const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true }, // Street number and name
    apartment: { type: String }, // Optional apartment or unit number
    city: { type: String, required: true },
    province: { type: String, required: true }, // Province code (e.g., "ON")
    postalCode: { type: String, required: true }, // Postal code in "A1A 1A1" format
    country: { type: String, required: true, default: 'Canada' }, // Default is "Canada"
    poBox: { type: String }, // Optional PO Box
  },
  { timestamps: true }
)

const Address = mongoose.model('Address', addressSchema)
module.exports = Address
