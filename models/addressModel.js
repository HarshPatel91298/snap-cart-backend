const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    name: { type: String }, // Label for the address (e.g., "Home", "Office")
    street: { type: String, required: true },
    apartment: { type: String }, // Optional apartment or unit number
    city: { type: String, required: true },
    province: { type: String, required: true }, // Province or state
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'Canada' }, // Default country is "Canada"
    poBox: { type: String }, // Optional PO Box
    phone: { type: String }, // Optional phone number
    isDefault: { type: Boolean, default: false }, // Marks the default address for the user
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
