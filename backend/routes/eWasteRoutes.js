const express = require('express');
const {
  createEwaste,
  getAllEwaste,
  getEwasteById,
  deleteEwaste
} = require('../controllers/ewasteController');
const upload = require('../middleware/upload');
const validateWalletAddress  = require('../middleware/validateWallet');

const router = express.Router();

// Public routes
router.get('/all', getAllEwaste);
router.get('/:id', getEwasteById);
router.post('/create', validateWalletAddress, upload.single('file'), createEwaste); 
router.delete('/:id', deleteEwaste);

module.exports = router;