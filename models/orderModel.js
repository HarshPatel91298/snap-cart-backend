const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Added cart_id
  order_status: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], // All possible statuses
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

const Order = mongoose.model('Order', orderSchema);
const OrderLine = mongoose.model('OrderLine', orderLineSchema);

module.exports = { Order, OrderLine };
