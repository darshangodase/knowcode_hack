const cron = require("node-cron");
const Ewaste = require("../models/EWaste");

// Function to schedule a cron job
const scheduleBiddingCheck = () => {
  // Schedule task to run every two minutes
  cron.schedule("*/1 * * * *", async () => {
    // console.log("Running bidding status scheduler...");
    try {
      const now = new Date();
      // console.log(now);
      
      // Find all e-waste items with active bidding that have expired
      const expiredBids = await Ewaste.find({
        biddingEnabled: true, // Ensure bidding is enabled
        biddingStatus: "active", // Only check items with active bidding
        biddingEndTime: { $lte: now }, // Bidding end time has passed
      });

      // Iterate over each expired e-waste item
      for (const ewaste of expiredBids) {
        // Update the bidding status to "stopped"
        ewaste.biddingStatus = "stopped";
        ewaste.statusHistory.push({ status: "stopped", timestamp: new Date() }); // Add to status history
        await ewaste.save(); // Save changes to the database

        // console.log(`Updated e-waste item ${ewaste._id} to "stopped".`);
      }

      // console.log("Bidding status scheduler completed.");
    } catch (err) {
      console.error("Error running bidding status scheduler:", err.message);
    }
  });
};

module.exports = { scheduleBiddingCheck };
