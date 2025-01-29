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
  biddingEnabled: { type: Boolean },
  biddingEndTime: { type: Date, required: function () { return this.biddingEnabled; } },
  imageUrl: { type: String },
  status: { type: String, enum: ["pending", "active", "stopped"], default: "pending" },
  biddingStatus: { type: String, enum: ["active", "stopped", "completed"], default: "active" },
  statusHistory: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Ewaste", EwasteSchema);
