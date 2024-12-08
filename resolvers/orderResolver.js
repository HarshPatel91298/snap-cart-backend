const { Order, OrderLine } = require('../models/orderModel');
const Cart  = require('../models/cartModel');
const { authenticateAndAuthorize } = require('../lib/auth'); // Import your auth utility
const { PERMISSIONS } = require('../lib/accessControl');

const orderResolver = {
  Query: {
    // Fetch orders with optional filters for user_id, created_at, or order_status
    getOrders: async (_, { created_at, order_status }, context) => {
    
    if (!context.user) {
      throw new Error('Unauthorized access');
    }
    const { user_id, role } = context.user;

    await authenticateAndAuthorize(context.user, PERMISSIONS.READ, 'order');

     const data = await Order.fetchOrders(user_id, role, created_at, order_status);


     console.log('order data', data[0].orderLines[0]);
      return {
        status: true,
        data: data,
        message: 'Orders retrieved successfully',
      }
    },
    // Fetch a single order by ID
    getOrderByID: async (_, { order_id }, context) => {
      console.log('context', context);
      if (!context.user) {
        throw new Error('Unauthorized access');
      }
      const { user_id, role } = context.user;
      const order = await Order.fetchOrderById(user_id, role, order_id);
      return {
        status: true,
        data: order,
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

      // Generate a unique order number with date and some random characters
      const order_number = `ORD-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
      // Create an empty order first
      const emptyOrder = new Order({
        user_id: user.db_id,
        cart_id,
        order_number,
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
      return Order.findById(savedOrder._id).populate('orderLines').populate('user_id', 'displayName email');
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
