const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_status: { type: String, required: true },
    order_date: { type: Date, default: Date.now },
    orderLineSchema: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'orderLineSchema'
    }],
    total_amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});



const orderLineSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});


// Get Order amount by ID
async function getOrderAmountById(orderId) {
    console.log("Method called");
    console.log('orderId', orderId);
    const order = await Order.findById(orderId);
    console.log('order', order);
    if (!order) {
        return 0;
    }
    return order.total_amount;
}

orderSchema.statics.getOrderAmountById = getOrderAmountById;


const Order = mongoose.model('Order', orderSchema);
const OrderLine = mongoose.model('OrderLine', orderLineSchema);

module.exports = { Order, OrderLine };