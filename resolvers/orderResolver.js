const { Order, OrderLine } = require('../models/orderModel');
const Cart  = require('../models/cartModel');
const { authenticateAndAuthorize } = require('../lib/auth'); // Import your auth utility

const orderResolver = {
  Query: {
    // Fetch orders with optional filters for user_id, created_at, or order_status
    getOrders: async (_, { created_at, order_status }, context) => {

    if (!context.user) {
      throw new Error('Unauthorized access');
    }

    await authenticateAndAuthorize(context.user, PERMISSIONS.READ, 'order');

      const filter = {};
      if (user_id) filter.user_id = user_id;
      if (created_at) filter.created_at = new Date(created_at);
      if (order_status) filter.order_status = order_status;
      return {
        status: true,
        data: Order.find(filter).populate('orderLines'),
        message: 'Orders retrieved successfully',
      }
    },
    // Fetch a single order by ID
    getOrder: async (_, { id }) => {
      return {
        status: true,
        data: Order.findById(id).populate('orderLines'),
        message: 'Order retrieved successfully',
      }
    }
  },
  Mutation: {
    // Mutation to create a new Order and associated OrderLines
    createOrder: async (_, { input }, context) => {
      const user = context.user;
      if (!user) {
        throw new Error('Unauthorized access');
      }
    
      const { cart_id, payment_method, address_id } = input;
    
      // Fetch cart details
      const cart = await Cart.findById(cart_id);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!cart.is_active) {
        throw new Error('Cart is already inactive');
      }
    
      // Create an empty order first
      const emptyOrder = new Order({
        user_id: user.db_id,
        cart_id,
        total_amount: 0, // Temporary value; we'll update this later
        payment_method,
        address_id,
        orderLines: [], // Empty for now; we'll populate it after creating OrderLines
      });
    
      // Save the empty order to get its _id
      const savedOrder = await emptyOrder.save();
    
      // Create order lines from cart products and associate them with the savedOrder._id
      const orderLinesData = cart.products.map((product) => ({
        order_id: savedOrder._id, // Use the newly created order's _id
        product_id: product.product_id,
        quantity: product.quantity,
        price: product.price,
      }));
    
      // Save order lines
      const savedOrderLines = await OrderLine.insertMany(orderLinesData);
    
      // Update the order with the saved order lines and total amount
      savedOrder.orderLines = savedOrderLines.map((line) => line._id);
      savedOrder.total_amount = cart.total_price; // Use cart's total price
      await savedOrder.save();
    
      // Deactivate the cart after order creation
      cart.is_active = false;
      await cart.save();
    
      // Return the final order with populated order lines
      return Order.findById(savedOrder._id).populate('orderLines');
    },
    

    // Mutation to update order status by admin
    updateOrderStatus: async (_, { input }, context) => {
      const { orderId, order_status } = input;

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { order_status, updated_at: new Date() },
        { new: true }
      ).populate('orderLines');

      if (!updatedOrder) {
        throw new Error('Order not found');
      }

      return updatedOrder;
    },
  },
};

module.exports = { orderResolver };
