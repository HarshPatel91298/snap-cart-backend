const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }, // Price of the product at the time of adding
    },
  ],
  sub_total: { type: Number, default: 0 }, // Subtotal of all products
  discount: { type: Number, default: 0 }, // Discount applied to the cart
  tax: { type: Number, default: 0 }, // Added field for applicable tax
  total_price: { type: Number, default: 0 }, // Total price before tax or discounts
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon", // Reference to Coupon collection
  },
  is_active: { type: Boolean, default: true }, // Represents whether the cart is active
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updated_at` on each document update
cartSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});


const getCartTotal = async function (cart_id) {
  const cart = await this.findById(cart_id);
  if (!cart) {
    throw new Error("Cart not found");
  }

  return cart.total_price;
};

cartSchema.statics.getCartTotal = getCartTotal;

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
