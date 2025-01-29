const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    eWaste: { type: mongoose.Schema.Types.ObjectId, ref: "Ewaste", required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { 
      type: Number, 
      required: true, 
      min: [1, "Bid amount must be at least 1"] 
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Bid", bidSchema);
