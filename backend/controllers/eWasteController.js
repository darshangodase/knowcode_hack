const Ewaste = require('../models/EWaste');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { cloudinary } = require('../utils/cloudinary');
const DonationRequest = require('../models/DonationRequest');
const Bid = require('../models/Bid');

// Create E-Waste Item
const createEwaste = async (req, res) => {
  const { itemName, category, condition, weight, quantity, location, donationOrSale, price, biddingEnabled, biddingEndTime } = req.body;
  
  const userWalletAddress = req.user.walletAddress;
  
  try {
    // Find user by wallet address
    const user = await User.findOne({ walletAddress: userWalletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate required fields
    if (!itemName || !category || !condition || !weight || !quantity || !location || !donationOrSale) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (donationOrSale === 'sell' && !price) {
      return res.status(400).json({ error: 'Price is required for selling' });
    }

    if (biddingEnabled && !biddingEndTime) {
      return res.status(400).json({ error: 'Bidding end time is required if bidding is enabled' });
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    const result = cloudinary.uploader.upload_stream(
      { folder: 'image_uploads' },
      async (error, response) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        imageUrl = response.secure_url;

        try {
          const ewaste = new Ewaste({
            user: user._id,
            walletAddress: userWalletAddress, // Store the wallet address
            itemName,
            category,
            weight,
            condition,
            quantity,
            location,
            donationOrSale,
            price: donationOrSale === 'sell' ? price : undefined,
            biddingEnabled,
            biddingEndTime: biddingEnabled ? biddingEndTime : undefined,
            imageUrl,
          });

          await ewaste.save();
          user.recycledItems.push(ewaste._id);
          await user.save();

          res.status(201).json({ message: 'E-Waste created successfully', ewaste });
        } catch (err) {
          console.error('Error saving e-waste to database:', err);
          return res.status(500).json({ error: 'Error saving e-waste to database' });
        }
      }
    );

    if (req.file) {
      result.end(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'No image file provided' });
    }
  } catch (err) {
    console.error('Error creating e-waste:', err);
    return res.status(500).json({ error: 'Server error while creating e-waste' });
  }
};


// Get All E-Waste Items
const getAllEwaste = async (req, res) => {
  try {
    const ewasteItems = await Ewaste.find();
    res.status(200).json(ewasteItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get E-Waste Item by ID
const getEwasteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Received request for e-waste ID:', id); // Log received ID

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid ID format:', id);
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const ewaste = await Ewaste.findById(id);
    console.log('Found e-waste:', ewaste); // Log found item

    if (!ewaste) {
      console.log('E-waste not found for ID:', id);
      return res.status(404).json({ error: 'E-waste item not found' });
    }

    res.json(ewaste);
  } catch (error) {
    console.error('Error in getEwasteById:', error);
    res.status(500).json({ error: error.message });
  }
};

// Place a Bid on an E-Waste Item
const placeBid = async (req, res) => {
  const { id } = req.params;
  const { user, amount } = req.body;

  try {
    const ewaste = await Ewaste.findById(id);
    if (!ewaste) {
      return res.status(404).json({ error: 'E-Waste item not found' });
    }

    // Check if bidding is enabled and not expired
    if (!ewaste.biddingEnabled) {
      return res.status(400).json({ error: 'Bidding is not enabled for this item' });
    }
    if (ewaste.biddingEndTime && ewaste.biddingEndTime < new Date()) {
      return res.status(400).json({ error: 'Bidding has ended for this item' });
    }

    // Add the bid
    ewaste.bids.push({ user, amount });
    await ewaste.save();

    res.status(201).json({ message: 'Bid placed successfully', ewaste });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update E-Waste Status (e.g., approve, reject, mark as sold)
const updateEwasteStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const ewaste = await Ewaste.findById(id);
    if (!ewaste) {
      return res.status(404).json({ error: 'E-Waste item not found' });
    }

    // Validate status
    if (!['pending', 'approved', 'rejected', 'sold'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update status
    ewaste.status = status;
    await ewaste.save();

    res.status(200).json({ message: 'E-Waste status updated successfully', ewaste });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete E-Waste Item
const deleteEwaste = async (req, res) => {
  const { id } = req.params;
  const userWalletAddress = req.user.walletAddress;

  try {
    console.log('Delete attempt:', { id, userWalletAddress }); // Debug log

    const ewaste = await Ewaste.findById(id);
    if (!ewaste) {
      console.log('E-waste not found');
      return res.status(404).json({ error: 'E-Waste item not found' });
    }

    // Check ownership using walletAddress
    if (ewaste.walletAddress !== userWalletAddress) {
      console.log('Unauthorized delete attempt', {
        itemWallet: ewaste.walletAddress,
        requestWallet: userWalletAddress
      });
      return res.status(403).json({ error: 'You are not authorized to delete this item' });
    }

    // Delete the item
    await Ewaste.findByIdAndDelete(id);
    
    // Remove from user's recycled items
    await User.findOneAndUpdate(
      { walletAddress: userWalletAddress },
      { $pull: { recycledItems: id } }
    );

    console.log('E-waste deleted successfully');
    res.status(200).json({ message: 'E-Waste item deleted successfully' });
  } catch (err) {
    console.error('Error in deleteEwaste:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add this new controller function
const updateBiddingStatus = async (req, res) => {
  const { id } = req.params;
  const { biddingStatus } = req.body;
  const userWalletAddress = req.user.walletAddress;

  try {
    console.log('Update bidding status attempt:', { id, biddingStatus, userWalletAddress }); // Debug log

    const ewaste = await Ewaste.findById(id);
    if (!ewaste) {
      console.log('E-waste not found');
      return res.status(404).json({ error: 'E-Waste item not found' });
    }

    // Check ownership using walletAddress
    if (ewaste.walletAddress !== userWalletAddress) {
      console.log('Unauthorized update attempt');
      return res.status(403).json({ error: 'You are not authorized to update this item' });
    }

    // Update bidding status
    ewaste.biddingStatus = biddingStatus;
    await ewaste.save();

    console.log('Bidding status updated successfully');
    res.status(200).json({ 
      message: 'Bidding status updated successfully',
      biddingStatus: ewaste.biddingStatus 
    });
  } catch (err) {
    console.error('Error in updateBiddingStatus:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add this function to get impact statistics
const getImpactStats = async (req, res) => {
  try {
    // Get all e-waste items
    const allEwaste = await Ewaste.find({});
    console.log('Found e-waste items:', allEwaste.length); // Debug log
    
    // Calculate statistics
    const stats = {
      totalEwaste: 0,
      totalDonated: 0,
      totalSold: 0,
      co2Saved: 0,
      donationCount: 0,
      saleCount: 0
    };

    allEwaste.forEach(item => {
      const weight = parseFloat(item.weight) || 0;
      stats.totalEwaste += weight;
      
      if (item.donationOrSale === 'donate') {
        stats.totalDonated += weight;
        stats.donationCount++;
      } else {
        stats.totalSold += weight;
        stats.saleCount++;
      }
    });

    // Calculate CO2 saved (1.44 kg CO₂ per 1 kg e-waste)
    stats.co2Saved = stats.totalEwaste * 1.44;

    console.log('Calculated stats:', stats); // Debug log

    res.json({
      success: true,
      stats: {
        totalEwaste: Math.round(stats.totalEwaste * 100) / 100,
        totalDonated: Math.round(stats.totalDonated * 100) / 100,
        totalSold: Math.round(stats.totalSold * 100) / 100,
        co2Saved: Math.round(stats.co2Saved * 100) / 100,
        donationCount: stats.donationCount,
        saleCount: stats.saleCount
      }
    });

  } catch (error) {
    console.error('Error in getImpactStats:', error); // Debug log
    res.status(500).json({ error: error.message });
  }
};

// Add this new controller function
const getUserPosts = async (req, res) => {
    try {
        const walletAddress = req.user.walletAddress;
        console.log('Fetching posts for wallet:', walletAddress); // Debug log

        // Find posts directly using walletAddress
        const posts = await Ewaste.find({ walletAddress })
            .sort({ createdAt: -1 });

        console.log('Found posts:', posts.length); // Debug log
        res.json(posts);
    } catch (error) {
        console.error('Error in getUserPosts:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add these new controller functions
const acceptDonationRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await DonationRequest.findById(requestId)
            .populate('ewaste');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Verify ownership
        if (request.ewaste.walletAddress !== req.user.walletAddress) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        request.status = 'accepted';
        await request.save();

        // Update e-waste status
        const ewaste = request.ewaste;
        ewaste.status = 'donated';
        await ewaste.save();

        res.json({ message: 'Donation request accepted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId);
    
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const ewaste = await Ewaste.findById(bid.eWaste);
    if (!ewaste) {
      return res.status(404).json({ error: 'E-waste item not found' });
    }

    // Check if user is authorized
    if (ewaste.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to accept this bid' });
    }

    // Check if any bid is already accepted
    const existingAcceptedBid = await Bid.findOne({ 
      eWaste: ewaste._id, 
      status: 'accepted' 
    });

    if (existingAcceptedBid) {
      return res.status(400).json({ error: 'A bid has already been accepted for this item' });
    }

    // Update the bid status
    bid.status = 'accepted';
    await bid.save();

    // Update all other bids to rejected
    await Bid.updateMany(
      { 
        eWaste: ewaste._id, 
        _id: { $ne: bidId } 
      },
      { status: 'rejected' }
    );

    // Update e-waste status
    ewaste.status = 'sold';
    ewaste.biddingStatus = 'completed';
    await ewaste.save();

    res.json({ message: 'Bid accepted successfully', bid });
  } catch (error) {
    console.error('Error accepting bid:', error);
    res.status(500).json({ error: 'Failed to accept bid' });
  }
};

// Add this new controller function
const getBids = async (req, res) => {
    try {
        const { ewasteId } = req.params;
        console.log('Fetching bids for ewaste:', ewasteId); // Debug log

        const bids = await Bid.find({ ewaste: ewasteId })
            .populate('bidder', 'name email walletAddress')
            .sort('-amount');

        console.log('Found bids:', bids.length); // Debug log
        res.json(bids);
    } catch (error) {
        console.error('Error in getBids:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add this new controller function
const getUserAcceptedRequests = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;

    // Find all user's e-waste posts
    const userPosts = await Ewaste.find({ walletAddress });
    
    const acceptedRequests = {
      donations: [],
      bids: []
    };

    // Get accepted donation requests
    for (const post of userPosts) {
      if (post.donationOrSale === 'donate') {
        const donationRequest = await DonationRequest.findOne({ 
          ewaste: post._id, 
          status: 'accepted' 
        }).populate('requester', 'name email walletAddress');
        
        if (donationRequest) {
          acceptedRequests.donations.push({
            postId: post._id,
            itemName: post.itemName,
            category: post.category,
            weight: post.weight,
            location: post.location,
            imageUrl: post.imageUrl,
            request: {
              id: donationRequest._id,
              requester: {
                name: donationRequest.requester.name,
                email: donationRequest.requester.email,
                walletAddress: donationRequest.requester.walletAddress
              },
              message: donationRequest.message,
              status: donationRequest.status,
              createdAt: donationRequest.createdAt
            }
          });
        }
      } else {
        // Get accepted bids
        const acceptedBid = await Bid.findOne({ 
          eWaste: post._id, 
          status: 'accepted' 
        }).populate('bidder', 'name email walletAddress');
        
        if (acceptedBid) {
          acceptedRequests.bids.push({
            postId: post._id,
            itemName: post.itemName,
            category: post.category,
            weight: post.weight,
            price: post.price,
            location: post.location,
            imageUrl: post.imageUrl,
            bid: {
              id: acceptedBid._id,
              amount: acceptedBid.amount,
              bidder: {
                name: acceptedBid.bidder.name,
                email: acceptedBid.bidder.email,
                walletAddress: acceptedBid.bidder.walletAddress
              },
              status: acceptedBid.status,
              createdAt: acceptedBid.createdAt
            }
          });
        }
      }
    }

    res.json(acceptedRequests);
  } catch (error) {
    console.error('Error getting accepted requests:', error);
    res.status(500).json({ error: 'Failed to get accepted requests' });
  }
};

// Add this new controller function
const getUserAcceptedBidsAndRequests = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    const user = await User.findOne({ walletAddress });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const myAcceptedRequests = {
      myAcceptedBids: [],
      myAcceptedDonations: []
    };

    // Find my accepted bids on others' posts
    const acceptedBids = await Bid.find({ 
      bidder: user._id,
      status: 'accepted'
    }).populate({
      path: 'eWaste',
      select: 'itemName category weight price location imageUrl walletAddress'
    });

    // Find my accepted donation requests on others' posts
    const acceptedDonations = await DonationRequest.find({
      requester: user._id,
      status: 'accepted'
    }).populate({
      path: 'ewaste',
      select: 'itemName category weight location imageUrl walletAddress'
    });

    // Format bids data - Add null checks
    myAcceptedRequests.myAcceptedBids = acceptedBids
      .filter(bid => bid.eWaste) // Only include bids where eWaste exists
      .map(bid => ({
        postId: bid.eWaste._id,
        itemName: bid.eWaste.itemName || 'Unknown Item',
        category: bid.eWaste.category || 'Uncategorized',
        weight: bid.eWaste.weight || 0,
        price: bid.eWaste.price || 0,
        location: bid.eWaste.location || 'Unknown Location',
        imageUrl: bid.eWaste.imageUrl || '',
        ownerWallet: bid.eWaste.walletAddress || 'Unknown',
        bidAmount: bid.amount || 0,
        bidDate: bid.createdAt
      }));

    // Format donation requests data - Add null checks
    myAcceptedRequests.myAcceptedDonations = acceptedDonations
      .filter(donation => donation.ewaste) // Only include donations where ewaste exists
      .map(donation => ({
        postId: donation.ewaste._id,
        itemName: donation.ewaste.itemName || 'Unknown Item',
        category: donation.ewaste.category || 'Uncategorized',
        weight: donation.ewaste.weight || 0,
        location: donation.ewaste.location || 'Unknown Location',
        imageUrl: donation.ewaste.imageUrl || '',
        ownerWallet: donation.ewaste.walletAddress || 'Unknown',
        message: donation.message || '',
        requestDate: donation.createdAt
      }));

    res.json(myAcceptedRequests);
  } catch (error) {
    console.error('Error getting user accepted bids and requests:', error);
    res.status(500).json({ 
      error: 'Failed to get accepted bids and requests',
      details: error.message 
    });
  }
};

module.exports = {
  createEwaste,
  getAllEwaste,
  getEwasteById,
  placeBid,
  updateEwasteStatus,
  deleteEwaste,
  updateBiddingStatus,
  getImpactStats,
  getUserPosts,
  acceptDonationRequest,
  acceptBid,
  getBids,
  getUserAcceptedRequests,
  getUserAcceptedBidsAndRequests
};
