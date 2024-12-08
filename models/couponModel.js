const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['FIXED', 'PERCENTAGE'], required: true },
    discount: { type: Number, required: true },
    max_discount: { type: Number, default: 0 },
    min_order_amount: { type: Number, default: 0 },
    valid_from: { type: Date, required: true },
    valid_until: { type: Date, required: true },
    applicable_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    applicable_categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    applicable_subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
    usage_limit: { type: Number, default: 0 },
    used_count: { type: Number, default: 0 },
    max_use_per_user: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    user_usage: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        usage_count: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        // Convert ObjectId fields to strings
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        ret.applicable_products = ret.applicable_products?.map((p) => p.toString());
        ret.applicable_categories = ret.applicable_categories?.map((c) => c.toString());
        ret.applicable_subcategories = ret.applicable_subcategories?.map((s) => s.toString());
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Coupon', couponSchema);


