const Bid = require("../models/Bid");
const Ewaste = require("../models/EWaste");

// Place a Bid
const placeBid = async (req, res) => {
  const { ewasteId } = req.params;
  const { amount } = req.body;
  const bidder = req.user._id; // Extracted from middleware

  try {
    // Find the e-waste item
    const ewaste = await Ewaste.findById(ewasteId);
    if (!ewaste) {
      return res.status(404).json({ error: "E-Waste item not found" });
    }

    // Check if bidding is enabled and active
    if (!ewaste.biddingEnabled) {
      return res.status(400).json({ error: "Bidding is not enabled for this item" });
    }
    if (ewaste.biddingStatus !== "active") {
      return res.status(400).json({ error: "Bidding is no longer active for this item" });
    }
    if (ewaste.biddingEndTime && ewaste.biddingEndTime < new Date()) {
      return res.status(400).json({ error: "Bidding has ended for this item" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({ error: "Invalid bid amount" });
    }

    // Check if this is the first bid
    const existingBids = await Bid.find({ eWaste: ewasteId });
    const isFirstBid = existingBids.length === 0;

    // Validate bid amount based on whether it's the first bid or not
    if (isFirstBid) {
      // First bid must be at least price + 1
      if (numericAmount <= ewaste.price) {
        return res.status(400).json({ 
          error: `First bid must be greater than the item price. Minimum bid: ₹${ewaste.price + 1}` 
        });
      }
    } else {
      // Subsequent bids must be greater than the last bid
      const lastBid = ewaste.lastBid;
      if (numericAmount <= lastBid) {
        return res.status(400).json({ 
          error: `Bid amount must be greater than the current highest bid (₹${lastBid})` 
        });
      }
    }

    // Create and save the new bid
    const bid = new Bid({
      eWaste: ewasteId,
      bidder,
      amount: numericAmount,
    });
    await bid.save();

    // Update the e-waste item with the latest bid
    ewaste.lastBid = numericAmount;
    await ewaste.save();

    res.status(201).json({ 
      message: "Bid placed successfully", 
      bid,
      minimumNextBid: numericAmount + 1 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Bids for a Specific E-Waste Item
const getBidsByEwasteId = async (req, res) => {
  try {
    const { ewasteId } = req.params;
    const bids = await Bid.find({ ewasteId })
      .populate('bidder', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: 'Error fetching bids' });
  }
};

// Get All Bids (Admin or General Use)
const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate("eWaste", "itemName")
      .populate("bidder", "walletAddress");
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { placeBid, getBidsByEwasteId, getAllBids };
