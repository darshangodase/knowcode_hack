const User = require('../models/User');
const Ewaste = require('../models/EWaste');

const getAllUsers = async (req, res) => {
    console.log("hitted")
    try {
        const users = await User.find()
            .populate({
                path: 'recycledItems',
                model: 'Ewaste'
            });

        // Process users to calculate total quantity and items recycled
        const processedUsers = users.map(user => {
            const totalQuantity = user.recycledItems.reduce((total, item) => total + (item.weight || 0), 0);
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                walletAddress: user.walletAddress,
                totalQuantity: Number(totalQuantity.toFixed(2)),
                itemsRecycled: user.recycledItems.length 
            };
        }).sort((a, b) => b.totalQuantity - a.totalQuantity); 
        console.log(processedUsers)
        res.json({ success: true, users: processedUsers });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllUsers
};
