const crypto = require('crypto');

const generateCryptoPayout = (amount, walletAddress) => {
  const transactionId = crypto.randomBytes(16).toString('hex');
  return { transactionId, amount, walletAddress };
};

module.exports = { generateCryptoPayout };