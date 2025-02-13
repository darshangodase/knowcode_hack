const User = require('../models/User');

const login = async (req, res) => {
  const  userInfo  = req.body;

  // Check if user information exists
  if (!userInfo) {
    return res.status(400).json({ error: 'User information is missing' });
  }

  try {
    // Check if the user already exists in the database using the email or walletAddress
    let user = await User.findOne({ $or: [{ email: userInfo.email }, { walletAddress: userInfo.walletAddress }] });

    if (user) {
      // If user exists, we could update or just return the existing user
      return res.status(200).json({ message: 'User already exists', user });
    } else {
      // If user does not exist, create a new user
      user = new User({
        name: userInfo.name,
        email: userInfo.email,
        walletAddress: userInfo.walletAddress,
        recycledItems: userInfo.recycledItems || [], 
        rewardsEarned: userInfo.rewardsEarned || 0, 
      });

      // Save the user to the database
      await user.save();

      return res.status(201).json({ message: 'User created successfully', user });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    return res.status(500).json({ error: 'Failed to save user' });
  }
};

module.exports = { login };
