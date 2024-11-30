const User = require('../models/userModel');
const { PERMISSIONS } = require('../lib/accessControl');
const { ForbiddenError } = require('apollo-server-express');
const { authenticateAndAuthorize } = require('../lib/auth'); // Import your auth utility
const admin = require('../lib/firebaseAdmin');
const { Readable } = require('stream');
const crypto = require('crypto');


// Generate a random password
const generateRandomPassword = (length = 12) => {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  };

const uploadImageToFirebase = async (binaryImage, imageName) => {
    const bucket = admin.storage().bucket();
    const file = bucket.file(imageName);
    
    const bufferStream = new Readable();
    bufferStream.push(binaryImage);
    bufferStream.push(null); // End the stream
    
    // Upload the image
    await new Promise((resolve, reject) => {
      const writeStream = file.createWriteStream({
        metadata: {
          contentType: 'image/jpeg', // Assuming the image is JPEG, you can adjust this based on actual image type
        }
      });
      
      bufferStream.pipe(writeStream);
      
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    
    // Get the file URL after upload
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    return fileUrl;
  };
  

const userResolver = {
    Query: {
        users: async (_, __, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'user');
            return await User.getUsers();
        },
        userByEmail: async (_, { email }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'userByEmail');

            const userData = await User.findOne({ email });
            if (!userData) {
                return { status: false, message: "User not found", data: null };
            }

            return { status: true, message: "User found", data: userData };
        },
        userByUID: async (_, { uid }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'userByUID');

            const userData = await User.getUserByUID(uid);
            if (!userData) {
                return { status: false, message: "User not found", data: null };
            }

            return { status: true, message: "User found", data: userData };
        }
    },
    Mutation: {
        createUser: async (_, { newUser }, context) => {
            const user = context.user;
            const existingUser = await User.getUserByEmail(newUser.email);
            if (existingUser) {
                return { status: false, message: "Email already exists", data: null };
            }

            const createdUser = new User(newUser);
            await createdUser.save();

            const claims = {
                role: createdUser.userRole,
                db_id: createdUser._id,
            };

            console.log("claims", claims);

            // Set custom claims for the user
            await admin.auth().setCustomUserClaims(createdUser.firebaseUID, claims);

            return { status: true, data: createdUser, message: "User created successfully" };
        },
        createAdminUser: async (_, { adminData }) => {
            const { firstName, lastName, email, phoneNumber, binaryImage } = adminData;
      
            try {
              // 1. Generate a random password
              const password = generateRandomPassword();
      
              // 2. Upload the binary image to Firebase Storage
              const imageName = `${firstName}-${lastName}-${Date.now()}.jpg`; // Create a unique image name
              const photoURL = await uploadImageToFirebase(binaryImage, imageName); // Get the URL after upload
      
              // 3. Create a user in Firebase Authentication
              const firebaseUser = await admin.auth().createUser({
                email,
                emailVerified: false,
                phoneNumber,
                displayName: `${firstName} ${lastName}`,
                photoURL, // Use the photo URL from Firebase Storage
                password, // Set the generated password
              });
      
              const firebaseUID = firebaseUser.uid;
      
              
      
              // 5. Save the user data in MongoDB
              const newUser = new User({
                email,
                displayName: `${firstName} ${lastName}`,
                firebaseUID,
                phoneNumber,
                photoURL, // Use the photo URL from Firebase Storage
                userRole: 'admin', // Role is set to admin
              });
      
              await newUser.save();

              // 4. Set custom claims (db_id and role)
              await admin.auth().setCustomUserClaims(firebaseUID, {
                db_id: newUser._id.toString(), // Set the database ID
                role: 'admin', // Set the role to admin
              });
      
              console.log('Custom claims set for user:', { db_id: firebaseUID, role: 'admin' });
      
              // 6. Return the user data in the expected response format
              return {
                status: true,
                data: {
                  id: newUser._id.toString(),
                  email: newUser.email,
                  displayName: newUser.displayName,
                  firebaseUID: newUser.firebaseUID,
                  photoURL: newUser.photoURL,
                  emailVerified: false,
                  phoneNumber: newUser.phoneNumber,
                  createdAt: newUser.createdAt,
                  creationTime: newUser.creationTime,
                  lastLoginAt: newUser.lastLoginAt,
                  lastSignInTime: newUser.lastSignInTime,
                  userRole: newUser.userRole,
                },
                message: 'Admin user created successfully',
              };
            } catch (error) {
              console.error('Error creating admin user:', error);
              return {
                status: false,
                data: null,
                message: 'Error creating admin user',
              };
            }
        },
        updateUser: async (_, { uid, userData }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'user');

            const updatedUser = await User.updateUserByUID(uid, userData);
            if (!updatedUser) {
                throw new ForbiddenError("User not found");
            }

            return { status: true, data: updatedUser, message: "User updated successfully" };
        },
        deleteUserById: async (_, { uid }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'user');

            const deletedUser = await User.deleteUserByUID(uid);
            if (!deletedUser || (deletedUser.deletedCount === 0)) {
                throw new ForbiddenError("User not found");
            }

            return { status: true, data: null, message: "User deleted successfully" };
        },
        makeAdmin: async (_, { uid }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'user'); // Make sure only authorized users can update roles
    
            // Find the user by UID
            const targetUser = await User.findOne({ firebaseUID: uid });
            if (!targetUser) {
                throw new ForbiddenError("User not found");
            }
    
            // Update the user's role to admin
            targetUser.userRole = 'admin';
            await targetUser.save();
    
            // Update Firebase custom claims to reflect the admin role
            const claims = {
                role: 'admin',
                db_id: targetUser._id,
            };

            console.log("claims", claims);
    
            // Set custom claims in Firebase
            await admin.auth().setCustomUserClaims(targetUser.firebaseUID, claims);
    
            return { status: true, data: targetUser, message: "User role updated to admin" };
        },
    
        removeAdmin: async (_, { uid }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'user'); // Ensure authorization
    
            // Find the user by UID
            const targetUser = await User.findOne({ firebaseUID: uid });
            if (!targetUser) {
                throw new ForbiddenError("User not found");
            }
    
            // Update the user's role to 'user'
            targetUser.userRole = 'user';
            await targetUser.save();
    
            // Update Firebase custom claims to reflect the user role
            const claims = {
                role: 'user',
                db_id: targetUser._id,
            };
    
            // Set custom claims in Firebase
            await admin.auth().setCustomUserClaims(targetUser.firebaseUID, claims);
    
            return { status: true, data: targetUser, message: "Admin access removed, user role set" };
        },
    
        makeUser: async (_, { uid }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'user'); // Ensure authorization
    
            // Find the user by UID
            const targetUser = await User.findOne({ firebaseUID: uid });
            if (!targetUser) {
                throw new ForbiddenError("User not found");
            }
    
            // Update the user's role to 'user'
            targetUser.userRole = 'user';
            await targetUser.save();
    
            // Update Firebase custom claims to reflect the user role
            const claims = {
                role: 'user',
                db_id: targetUser._id,
            };
    
            // Set custom claims in Firebase
            await admin.auth().setCustomUserClaims(targetUser.firebaseUID, claims);
    
            return { status: true, data: targetUser, message: "User role set to user" };
        }
    },
};

module.exports = { userResolver };
