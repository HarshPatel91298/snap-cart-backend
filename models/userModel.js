const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  displayName: { type: String },
  firebaseUID: { type: String, required: true },
  photoURL: { type: String },
  emailVerified: { type: Boolean, required: true },
  phoneNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  creationTime: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
  lastSignInTime: { type: Date, default: Date.now }
});


// Get User by Email
async function getUserByEmail(email) {
    try {
      // Find a user by email
      const user = await User.findOne({ email: email });
      console.log("User found:", user);
      return user;   
    }
    catch (error) {
      console.error("Error finding user:", error);
    }
}

// Update User by UID
async function updateUserByUID(uid, userData) {
    try {
      // Find a user by UID and update
      console.log(uid);
      console.log(userData);
      const updatedUser = await User.findOneAndUpdate({ firebaseUID: uid }, userData, { new: true });
      console.log("User updated:", updatedUser);
      return updatedUser;
    }
    catch (error) {
      console.error("Error updating user:", error);
    }
}
userSchema.statics.getUserByEmail = getUserByEmail;
userSchema.statics.updateUserByUID = updateUserByUID;

// Create a model from the schema
const User = mongoose.model('User', userSchema);
module.exports = User;
