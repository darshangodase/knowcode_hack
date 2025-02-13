const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
  ewaste: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ewaste', 
    required: true 
  },
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  message: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('DonationRequest', donationRequestSchema); 