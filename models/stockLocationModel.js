const mongoose = require('mongoose')

const stockLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    warehouse_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Warehouse',
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
) // Automatically adds createdAt and updatedAt fields

const StockLocation = mongoose.model('StockLocation', stockLocationSchema)
module.exports = StockLocation
