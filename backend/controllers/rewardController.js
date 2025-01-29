const User = require('../models/User');
const { generateCryptoPayout } = require('../utils/cryptoPayout');

const getRewards = async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ rewardsEarned: user.rewardsEarned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const claimReward = async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.rewardsEarned <= 0) {
      return res.status(400).json({ error: 'No rewards available to claim' });
    }

    const payout = generateCryptoPayout(user.rewardsEarned, user.walletAddress);
    
    // Reset rewards after successful payout
    user.rewardsEarned = 0;
    await user.save();

    res.json({ message: 'Rewards claimed successfully', payout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRewards, claimReward };
