const Bid = require("../models/Bid");
const Ewaste = require("../models/Ewaste");

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
    console.log(ewaste);

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

    // Check if the bid amount is greater than the last bid
    const lastBid = ewaste.lastBid || 0; // Default to 0 if no bids yet
    const numericAmount = parseFloat(amount); // Ensure the amount is a number
    if (isNaN(numericAmount) || numericAmount <= lastBid) {
      return res
        .status(400)
        .json({ error: `Bid amount must be greater than the current highest bid (${lastBid})` });
    }

    // Create a new bid
    const bid = new Bid({
      eWaste: ewasteId,
      bidder,
      amount: numericAmount, // Store the numeric value
    });

    // Save the bid
    await bid.save();

    // Update the e-waste item with the latest bid
    ewaste.lastBid = numericAmount; // Store the last bid amount
    await ewaste.save();

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Bids for a Specific E-Waste Item
const getBidsByEwasteId = async (req, res) => {
  const { ewasteId } = req.params;

  try {
    const bids = await Bid.find({ eWaste: ewasteId })
      .populate("bidder", "walletAddress")
      .sort({ amount: -1 }); // Sort bids by highest amount
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
