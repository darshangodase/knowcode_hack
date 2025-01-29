const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
const { getRewards, claimReward } = require('../controllers/rewardController');

router.get('/', getRewards);
router.post('/claim', claimReward);

module.exports = router;
