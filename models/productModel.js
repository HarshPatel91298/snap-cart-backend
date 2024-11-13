const mongoose = require('mongoose')
const {Attachment} = require('./attachmentModel')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
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
  stock: { type: Number, required: true },
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

const Product = mongoose.model('Product', productSchema)
module.exports = Product
