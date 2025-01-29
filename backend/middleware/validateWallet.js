// middleware/validateWallet.js
const User = require('../models/User');

const validateWalletAddress = async (req, res, next) => {
  const walletAddress = req.headers['authorization']; // Make sure wallet address is passed here
  console.log('Middleware: Validating wallet address', walletAddress);
  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address missing from Authorization header' });
  }

  try {
    // Check if the wallet address exists in the User model
    const userExists = await User.findOne({ walletAddress });

    if (!userExists) {
      return res.status(404).json({ error: 'User with this wallet address not found' });
    }

    // Attach user object to request for later use in controller
    req.user = userExists;
    console.log('Middleware: User validated', req.user);  
    next();
  } catch (err) {
    console.error('Error validating wallet address:', err);
    return res.status(500).json({ error: 'Server error while validating wallet address' });
  }
};

module.exports = validateWalletAddress;
