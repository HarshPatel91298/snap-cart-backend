const mongoose = require('mongoose')

const stockMgmtSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    warehouse_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Warehouse',
    },
    stock_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'StockLocation',
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
)

const StockMgmt = mongoose.model('StockMgmt', stockMgmtSchema)
module.exports = StockMgmt
