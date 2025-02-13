const express = require('express');
const { createDonationRequest, getDonationRequests } = require('../controllers/donationController');
const validateWalletAddress = require('../middleware/validateWallet');

const router = express.Router();

router.post('/:ewasteId/request', validateWalletAddress, createDonationRequest);
router.get('/:ewasteId/requests', validateWalletAddress, getDonationRequests);

module.exports = router; 