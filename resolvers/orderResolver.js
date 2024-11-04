const { Order, OrderLine } = require('../models/orderModel');

const orderResolver = {
  Query: {
    // Fetch orders with optional filters for user_id, created_at, or order_status
    getOrders: async (_, { user_id, created_at, order_status }) => {
      const filter = {};
      if (user_id) filter.user_id = user_id;
      if (created_at) filter.created_at = new Date(created_at);
      if (order_status) filter.order_status = order_status;
      return await Order.find(filter).populate('orderLines');
    },
    // Fetch a single order by ID
    getOrder: async (_, { id }) => {
      return await Order.findById(id).populate('orderLines');
    }
  },
  Mutation: {
    // Mutation to create a new Order and associated OrderLines
    createOrder: async (_, { input }) => {
      const order = await Order.create(input);

      // Safely map over `orderLines`, defaulting to an empty array if it's undefined
      return {
        ...order,
        orderLines: (order.orderLines || []).map(line => ({
          ...line,
          id: line.id.toString() // Convert ID to string if it's an ObjectId
        }))
      };
    },

    // Mutation to update order status by admin
    updateOrderStatus: async (_, { input }) => {
      const { orderId, order_status } = input;
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { order_status, updated_at: new Date() },
        { new: true }
      );
      return updatedOrder;
    }
  }
};

module.exports = {orderResolver};
