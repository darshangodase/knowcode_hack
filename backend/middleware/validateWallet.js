// middleware/validateWallet.js
const User = require('../models/User');

const validateWalletAddress = async (req, res, next) => {
  console.log('Headers:', req.headers); // Debug log
  const walletAddress = req.headers.authorization;

  if (!walletAddress) {
    console.log('No wallet address provided');
    return res.status(401).json({ error: 'No wallet address provided' });
  }

  try {
    // Check if the wallet address exists in the User model
    const userExists = await User.findOne({ walletAddress });

    if (!userExists) {
      return res.status(404).json({ error: 'User with this wallet address not found' });
    }

    // Attach user object to request for later use in controller
    req.user = userExists;
    console.log('Validated wallet:', walletAddress); // Debug log
    next();
  } catch (err) {
    console.error('Error validating wallet address:', err);
    return res.status(500).json({ error: 'Server error while validating wallet address' });
  }
};

module.exports = validateWalletAddress;
