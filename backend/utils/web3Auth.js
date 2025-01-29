const Web3 = require('web3');
const jwt = require('jsonwebtoken');

const web3 = new Web3(process.env.WEB3_PROVIDER);

const authenticateUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const verifySignature = async (message, signature, address) => {
  try {
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    throw new Error('Invalid signature');
  }
};

module.exports = { authenticateUser, verifySignature };