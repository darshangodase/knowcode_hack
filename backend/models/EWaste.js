const mongoose = require("mongoose");

const EwasteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  weight: { type: Number, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  donationOrSale: { type: String, enum: ["donate", "sell"], required: true },
  price: { type: Number },
  biddingEnabled: { type: Boolean, default: false },
  biddingEndTime: { type: Date },
  imageUrl: { type: String },
  status: { type: String, default: "pending" },
  biddingStatus: { type: String, default: "active" },
  lastBid: { type: Number },
  walletAddress: { type: String },
  statusHistory: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Ewaste", EwasteSchema);
