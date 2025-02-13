const express = require("express");
const { getAllUsers } = require("../controllers/dashboardController");
const router = express.Router();

router.get("/leaderboard", getAllUsers); 

module.exports = router;
