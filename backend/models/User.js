const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true, unique: true },
  recycledItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ewaste' }],
  rewardsEarned: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
