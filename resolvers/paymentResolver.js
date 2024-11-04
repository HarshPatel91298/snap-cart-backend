// resolvers.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order } = require('../models/orderModel');

// Define your order amount calculation function
const calculateOrderAmount = async (items) => {
  console.log("items", items);
  const order_id = items[0].order_id;
  const orderAmount = await Order.getOrderAmountById(order_id);
  console.log("orderAmount", orderAmount);
  // For simplicity, assume each item has a fixed amount or perform
  // custom calculation here based on item data.



  return orderAmount * 100;
};

// Define the resolver for createPaymentIntent mutation
const paymentResolver = {
  Mutation: {
    async createPaymentIntent(_, { items }) {
      console.log(items);
      const amount = await calculateOrderAmount(items);
      console.log("amount", amount);

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'cad',
          automatic_payment_methods: { enabled: true },
        });

        return {
          clientSecret: paymentIntent.client_secret,
          dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        };
      } catch (error) {
        throw new Error(`Payment initiation failed: ${error.message}`);
      }
    },
  },
};

module.exports = {paymentResolver};
