const DonationRequest = require('../models/DonationRequest');
const User = require('../models/User');
const Ewaste = require('../models/EWaste');

// Create a donation request
const createDonationRequest = async (req, res) => {
  try {
    const { ewasteId } = req.params;
    const { message } = req.body;
    
    // Find the user
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if ewaste exists and is for donation
    const ewaste = await Ewaste.findById(ewasteId);
    if (!ewaste) {
      return res.status(404).json({ error: 'E-waste item not found' });
    }

    // Verify it's a donation item
    if (ewaste.donationOrSale !== 'donate') {
      return res.status(400).json({ error: 'This item is not available for donation' });
    }

    // Check if user is not requesting their own item
    if (ewaste.user.toString() === user._id.toString()) {
      return res.status(400).json({ error: 'You cannot request your own donation item' });
    }

    // Check for existing pending request
    const existingRequest = await DonationRequest.findOne({
      ewaste: ewasteId,
      requester: user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        error: 'You already have a pending request for this item' 
      });
    }

    // Create new donation request
    const donationRequest = new DonationRequest({
      ewaste: ewasteId,
      requester: user._id,
      message: message || 'Interested in this donation'
    });

    await donationRequest.save();

    res.status(201).json({
      message: 'Donation request sent successfully',
      donationRequest
    });

  } catch (error) {
    console.error('Donation request error:', error);
    res.status(500).json({ 
      error: 'Failed to create donation request' 
    });
  }
};

// Get donation requests for an ewaste item
const getDonationRequests = async (req, res) => {
  try {
    const { ewasteId } = req.params;
    const requests = await DonationRequest.find({ ewaste: ewasteId })
      .populate('requester', 'walletAddress')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDonationRequest,
  getDonationRequests
}; 
