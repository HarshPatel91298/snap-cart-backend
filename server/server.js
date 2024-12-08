const express = require("express");
const { ApolloServer, ApolloError } = require("apollo-server-express");
const admin = require("../lib/firebaseAdmin"); // Firebase Admin SDK
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { DBConnect } = require("./dbserver"); // Database connection
const { emailVerificationCron } = require("../cron/emailVerificationCron"); // Email verification cron job
const { isTokenExpired } = require("../lib/auth"); // Import the auth utility
const bodyParser = require('body-parser');


// Import schemas and resolvers
const { userSchema } = require("../schemas/userSchema");
const { userResolver } = require("../resolvers/userResolver");
const { brandSchema } = require("../schemas/brandSchema");
const { brandResolver } = require("../resolvers/brandResolver");
const { categorySchema } = require("../schemas/categorySchema");
const { categoryResolver } = require("../resolvers/categoryResolver");
const { subCategorySchema } = require("../schemas/subCategorySchema");
const { subCategoryResolver } = require("../resolvers/subCategoryResolver");
const { warehouseSchema } = require("../schemas/warehouseSchema");
const { warehouseResolver } = require("../resolvers/warehouseResolver");
const { stockLocationSchema } = require("../schemas/stockLocationSchema");
const { stockLocationResolver } = require("../resolvers/stockLocationResolver");
const { productSchema } = require("../schemas/productSchema");
const { productResolver } = require("../resolvers/productResolver");
const { addressSchema } = require("../schemas/addressSchema");
const { addressResolver } = require("../resolvers/addressResolver");
const { stockMgmtSchema } = require("../schemas/stockMgmtSchema");
const { stockMgmtResolver } = require("../resolvers/stockMgmtResolver");
const { cartSchema } = require("../schemas/cartSchema");
const { cartResolver } = require("../resolvers/cartResolver");
const { orderSchema } = require('../schemas/orderSchema');
const { orderResolver } = require('../resolvers/orderResolver');
const { paymentSchema } = require('../schemas/paymentSchema');
const { paymentResolver } = require('../resolvers/paymentResolver');
const { attachmentSchema } = require("../schemas/attachmentSchema");
const { attachmentResolver } = require("../resolvers/attachmentResolver");
const { couponSchema } = require("../schemas/couponSchema");
const { couponResolver } = require("../resolvers/couponResolver");


// Merge all schemas and resolvers
const typeDefs = mergeTypeDefs([
  userSchema,
  brandSchema,
  categorySchema,
  subCategorySchema,
  warehouseSchema,
  stockLocationSchema,
  productSchema,
  addressSchema,
  stockMgmtSchema,
  cartSchema,
  orderSchema,
  paymentSchema,
  attachmentSchema,
  couponSchema,
]);
  


const resolvers = mergeResolvers([
  userResolver,
  brandResolver,
  categoryResolver,
  subCategoryResolver,
  warehouseResolver,
  stockLocationResolver,
  productResolver,
  addressResolver,
  stockMgmtResolver,
  cartResolver,
  orderResolver,
  paymentResolver,
  attachmentResolver,
  couponResolver,
]);


// Function to verify Firebase tokens
const authenticateToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const isExpired = isTokenExpired(decodedToken);
    if (isExpired) {
      throw new ApolloError(
        "Authentication Failed: Invalid or Expired Token",
        "UNAUTHENTICATED"
      );
    }
    return decodedToken; // This is the authenticated user's data
  } catch (error) {
    throw new ApolloError(
      "Authentication Failed: Invalid or Expired Token",
      "UNAUTHENTICATED"
    );
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: async ({ req }) => {
    const token = req.headers.authorization || null;
    console.log("Token:", token);
    if (!token) {
      // throw new ApolloError('Authentication Error: No token provided', 'UNAUTHENTICATED');
      return { user: { userRole: 'guest' }}; // Return empty user if not authenticated
    }

    const firebaseToken = token.replace("Bearer ", "");
    if (!firebaseToken) {
      throw new ApolloError(
        "Authentication Error: Invalid token format",
        "UNAUTHENTICATED"
      );
    }

    try {
      const user = await authenticateToken(firebaseToken);
      console.log("Authenticated User: ", user);
      if (!user) {
        throw new ApolloError("User not found", "UNAUTHENTICATED");
      }

      // console.log(" ___ Authenticated User: ____", user);

      return { user }; // Return user if authenticated
    } catch (error) {
      // throw new ApolloError('Authentication Error: ' + error.message, 'UNAUTHENTICATED');
    }
  },
});

// Initialize Express App
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Apply Apollo Server middleware to the Express app
server.start().then(async () => {
  
  server.applyMiddleware({ app, path: "/graphql" }); // Set GraphQL endpoint

  // Start the Express server
  const port = process.env.API_PORT || 4000;
  app.listen(port, () => {
    DBConnect(); // Connect to the database
    emailVerificationCron(); // Start the email verification cron job
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
});
