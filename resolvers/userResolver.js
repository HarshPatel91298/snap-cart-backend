const User = require('../models/userModel');
const { PERMISSIONS } = require('../lib/accessControl');
const { ForbiddenError } = require('apollo-server-express');
const { authenticateAndAuthorize } = require('../lib/auth'); // Import your auth utility

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

            return { status: true, data: createdUser, message: "User created successfully" };
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
    },
};

module.exports = { userResolver };
