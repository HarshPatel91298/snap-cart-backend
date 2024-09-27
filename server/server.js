const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const admin = require('../lib/firebaseAdmin'); // Firebase Admin SDK
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { DBConnect } = require('./dbserver'); // Database connection
const { emailVerificationCron } = require('../cron/emailVerificationCron'); // Email verification cron job

// Import the user schema and resolver
const { userSchema } = require('../schemas/userSchema');
const { userResolver } = require('../resolvers/userResolver');
const { brandSchema } = require('../schemas/brandSchema');
const { brandResolver } = require('../resolvers/brandResolver');
const { categorySchema } = require('../schemas/categorySchema');
const { categoryResolver } = require('../resolvers/categoryResolver');
const { subCategorySchema } = require('../schemas/subCategorySchema');
const { subCategoryResolver } = require('../resolvers/subCategoryResolver');

// Merge the user schema and resolver
const typeDefs = mergeTypeDefs([userSchema, brandSchema, categorySchema, subCategorySchema]);
const resolvers = mergeResolvers([userResolver, brandResolver, categoryResolver, subCategoryResolver]);

// Create a function to verify Firebase tokens
const authenticateToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // This is the authenticated user's data
  } catch (error) {
    throw new Error('Authentication Failed: Invalid or Expired Token');
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || null;

    // Log token for debugging purposes (remove or comment out in production)
    // console.log('Authorization Header:', token);

    // Remove 'Bearer ' from token string

    if (!token) {
      console.log("No token");
      return { user: null }; // No user authenticated
    } 

    const firebaseToken = token.replace('Bearer ', '');

    try {
      if (firebaseToken) {
        const user = await authenticateToken(firebaseToken);
        return { user }; // Add user to context
      } else {
        return { user: null }; // No user authenticated
      }
    } catch (error) {
      // Handle authentication errors
    //   throw new ApolloError('Authentication Error: ' + error.message, 'UNAUTHENTICATED');
    }
  },
});

// Initialize Express App
const app = express();

// Apply Apollo Server middleware to the Express app
server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' }); // Set the GraphQL endpoint

  // Start the Express server
  const port = process.env.API_PORT || 4000;
  app.listen(port, () => {
    DBConnect(); // Connect to the database
    emailVerificationCron(); // Start the email verification cron job
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
});
