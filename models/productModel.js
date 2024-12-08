const mongoose = require('mongoose')
const {Attachment} = require('./attachmentModel')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost_price: { type: Number, required: true },
  price: { type: Number, required: true },
  color: { type: String },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  sub_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  display_image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment',
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attachment',
    },
  ],
  sku: {
    type: String,
    unique: true,
  },
  is_active: { type: Boolean, default: true },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

async function fetchMultiProducts(ids) {
  try {
    const products = await this.find({ _id: { $in: ids } }).populate('display_image').populate('images');
    return products;
  } catch (error) {
    throw new Error(error);
  }
}

productSchema.statics.fetchMultiProducts = fetchMultiProducts;

const Product = mongoose.model('Product', productSchema)
module.exports = Product
