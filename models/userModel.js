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
  lastSignInTime: { type: Date, default: Date.now },
  userRole: { type: String, required: true, default: 'user' }
});
// Get all users
async function getUsers() {
    try {
      // Find all users
      const users = await User.find();
      console.log("Users found:", users);
      return users;
    }
    catch (error) {
      console.error("Error finding users:", error);
    }
}

async function getAdmins() {
    try {
      // Find all users
      const users = await User.find({ userRole: 'admin' });
      console.log("Admins found:", users);
      return users;
    }
    catch (error) {
      console.error("Error finding admins:", error);
    }
}

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

// Get User by UID of Firebase
async function getUserByUID(uid) {
    try {
      // Find a user by UID
      console.log(uid);
      const user = await User.findOne({ firebaseUID: uid });
      console.log(uid);
      console.log("User found:", user);
      return user;
    }
    catch (error) {
      console.error("Error finding user:", error);
    }
}

// Get User Role
async function getUserRole(uid) {
    try {
      // Find a user by UID
      const user = await User.findOne({ firebaseUID: uid });
      if (!user) {
        throw new Error("User not found");
      }
      return user.userRole;
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

// Delete User by UID
async function deleteUserByUID(uid) {
    try {
      // Find a user by UID and delete
      const deletedUser = await User.findOneAndDelete({ firebaseUID: uid });
      console.log("User deleted:", deletedUser);
      return deletedUser;
    }
    catch (error) {
      console.error("Error deleting user:", error);
    }
}
userSchema.statics.getUsers = getUsers;
userSchema.statics.getAdmins = getAdmins;
userSchema.statics.getUserByEmail = getUserByEmail;
userSchema.statics.updateUserByUID = updateUserByUID;
userSchema.statics.getUserByUID = getUserByUID;
userSchema.statics.getUserRole = getUserRole;
userSchema.statics.deleteUserByUID = deleteUserByUID;

// Create a model from the schema
const User = mongoose.model('User', userSchema);
module.exports = User;
