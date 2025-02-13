const express = require('express');
const {
  createEwaste,
  getAllEwaste,
  getEwasteById,
  deleteEwaste,
  updateBiddingStatus,
  getImpactStats,
  getUserPosts,
  acceptDonationRequest,
  acceptBid,
  getBids
} = require('../controllers/eWasteController');
const upload = require('../middleware/upload');
const validateWalletAddress = require('../middleware/validateWallet');
const { createDonationRequest, getDonationRequests } = require('../controllers/donationController');

const router = express.Router();

// Public routes (specific routes first)
router.get('/impact-stats', getImpactStats);
router.get('/user-posts', validateWalletAddress, getUserPosts);
router.get('/all', getAllEwaste);

// Parameterized routes
router.get('/:id', getEwasteById);
router.post('/create', validateWalletAddress, upload.single('file'), createEwaste);
router.delete('/:id', validateWalletAddress, deleteEwaste);
router.patch('/:id/status', validateWalletAddress, updateBiddingStatus);

// Donation and bid routes
router.get('/:ewasteId/bids', validateWalletAddress, getBids);
router.get('/:ewasteId/donation-requests', validateWalletAddress, getDonationRequests);
router.post('/:ewasteId/donation-request', validateWalletAddress, createDonationRequest);
router.post('/donation-request/:requestId/accept', validateWalletAddress, acceptDonationRequest);
router.post('/bid/:bidId/accept', validateWalletAddress, acceptBid);

module.exports = router;
