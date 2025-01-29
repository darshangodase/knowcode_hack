const { authenticateUser } = require('../utils/web3Auth');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const userInfo = await authenticateUser(token);
    req.user = userInfo;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;