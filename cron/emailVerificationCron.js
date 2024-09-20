// cron/emailVerificationCron.js

const cron = require('node-cron');
const User = require('../models/userModel');  // Adjust the path accordingly
const admin = require('../lib/firebaseAdmin');  // Adjust the path accordingly

// Define the cron job
const emailVerificationCron = () => {
  cron.schedule('*/10 * * * * *', async () => {
    try {
      // Fetch users from MongoDB
      const users = await User.find({ emailVerified: false });

      for (const user of users) {
        // Get Firebase user by UID
        const firebaseUser = await admin.auth().getUser(user.firebaseUID);

        // Check if the emailVerified field is different
        if (user.emailVerified !== firebaseUser.emailVerified) {
          // Update emailVerified field in MongoDB
          user.emailVerified = firebaseUser.emailVerified;
          await user.save();

          console.log(`Updated emailVerified for user ${user}`);
          console.log(`Updated emailVerified for user ${user.email}`);
        }
      }
    } catch (error) {
      console.error('Error running cron job:', error);
    }
  });
};

module.exports = {emailVerificationCron};
