// warehouseModel.js
const mongoose = require('mongoose')

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
) // Automatically adds createdAt and updatedAt fields

const Warehouse = mongoose.model('Warehouse', warehouseSchema)
module.exports = Warehouse
