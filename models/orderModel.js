const mongoose = require('mongoose');
const { populate } = require('./cartModel');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  order_number: { type: String, required: true, unique: true },
  order_status: {
    type: String,
    enum: ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'], // All possible statuses
    default: 'Placed', // Default value
  },
  order_date: { type: Date, default: Date.now },
  orderLines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderLine',
    },
  ],
  total_amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const orderLineSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Fetch orders based on user_id, role, created_at, and order_status
// If role is "user", only fetch orders for the user_id
async function fetchOrders(user_id, role , created_at, order_status) {
  try {
    const filter = {};
    if (user_id && role === "user") filter.user_id = user_id;
    if (created_at) filter.created_at = new Date(created_at);
    if (order_status) filter.order_status = order_status;

    // Populate orderLines field
    return this.find(filter)
      .populate('orderLines') // Populates orderLines field
      .populate('user_id', 'displayName email') // Populates user_id field;
      .populate('address_id'); // Populates address_id field
  } catch (error) {
    throw new Error(error);
  }
}

// Fetch orders based on order_id
async function fetchOrderById(user_id, role, order_id) {
  try {
    const filter = {};
    if (user_id && role === "user") filter.user_id = user_id;
    filter._id = order_id;
    return this.findOne(filter)
    .populate('orderLines')
    .populate('user_id', 'displayName email')
    .populate('address_id');
  } catch (error) {
    throw new Error(error);
  }
}

orderSchema.statics.fetchOrders = fetchOrders;
orderSchema.statics.fetchOrderById = fetchOrderById;

const Order = mongoose.model('Order', orderSchema);
const OrderLine = mongoose.model('OrderLine', orderLineSchema);

module.exports = { Order, OrderLine };
