const Address = require('../models/addressModel')

const addressResolver = {
  Query: {
    addresses: async () => {
      try {
        const addresses = await Address.find()
        return {
          status: true,
          data: addresses,
          message: 'Addresses fetched successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    addressById: async (_, { id }) => {
      try {
        const address = await Address.findById(id)
        if (!address) {
          return { status: false, data: null, message: 'Address not found' }
        }
        return { status: true, data: address, message: 'Address found' }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
  Mutation: {
    addAddress: async (_, { addressInput }) => {
      try {
        const newAddress = new Address(addressInput)
        const address = await newAddress.save()
        if (!address) {
          return { status: false, data: null, message: 'Address not created' }
        }
        return {
          status: true,
          data: address,
          message: 'Address created successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    updateAddress: async (_, { id, addressInput }) => {
      try {
        const address = await Address.findByIdAndUpdate(id, addressInput, {
          new: true,
        })
        if (!address) {
          return { status: false, data: null, message: 'Address not found' }
        }
        return {
          status: true,
          data: address,
          message: 'Address updated successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    deleteAddress: async (_, { id }) => {
      try {
        const address = await Address.findByIdAndDelete(id)
        if (!address) {
          return { status: false, data: null, message: 'Address not found' }
        }
        return {
          status: true,
          data: null,
          message: 'Address deleted successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
}

module.exports = { addressResolver }
