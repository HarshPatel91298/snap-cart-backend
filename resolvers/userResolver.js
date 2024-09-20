const User = require('../models/userModel');

const userResolver = {
    Query: {
        userByEmail: async (_, { email }, context) => {
            try {
                // Check if the user is authenticated
                const res = {};

                console.log("Email: ", email);

                if (context.user) {
                    // Fetch the user by email
                    const user = await User.findOne({ email });
                    if (!user) {
                        res.data = null;
                        res.message = "User not found";
                    } else {
                        res.data = user;
                        res.message = "User found";
                    }
                } else {
                    res.data = null;
                    res.message = "Authentication Token Required";
                }

                return res;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
    Mutation: {
        createUser: async (_, { newUser }, context) => {
            try {
                const res = {};

                console.log(context);

                if (context.user) {
                    // Check if email already exists
                    const existingUser = await User.findOne({ email: newUser.email });
                    if (existingUser) {
                        res.data = null;
                        res.message = "Email already exists";
                        return res;
                    }

                    // Create and save the new user
                    const user = new User(newUser);

                    await user.save()
                        .then((data) => {
                            res.data = data;
                            res.message = "User created successfully";
                        })
                        .catch((err) => {
                            console.log(err);
                            res.data = null;
                            res.message = "Failed to create user";
                        });
                } else {
                    res.data = null;
                    res.message = "Authentication Token Required";
                }

                return res;

            } catch (error) {
                throw new Error(error.message);
            }
        },
        updateUser: async (_, { uid, userData }, context) => {
            try {
                const res = {};
                console.log(context);
                console.log("UID: ", uid);
                console.log("UserData: ", userData);
                if (context.user) {
                    // Update the user by UID
                    const updatedUser = await User.updateUserByUID(uid, userData);
                    if (!updatedUser) {
                        res.data = null;
                        res.message = "User not found";
                    } else {
                        res.data = updatedUser;
                        res.message = "User updated successfully";
                    }
                } else {
                    res.data = null;
                    res.message = "Authentication Token Required";
                }

                return res;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
};

module.exports = { userResolver };
