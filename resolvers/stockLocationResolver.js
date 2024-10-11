// stockLocationResolver.js
const StockLocation = require('../models/stockLocationModel')

const stockLocationResolver = {
  Query: {
    getStockLocation: async (_, { id }) => {
      try {
        const stockLocation = await StockLocation.findById(id)
        if (!stockLocation) {
          return {
            status: false,
            data: null,
            message: 'Stock location not found',
          }
        }
        return {
          status: true,
          data: stockLocation,
          message: 'Stock location retrieved successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    listStockLocations: async () => {
      try {
        const stockLocations = await StockLocation.find()
        return {
          status: true,
          data: stockLocations,
          message: 'Stock location list retrieved successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    getStockLocationCount: async (_, { is_active }) => {
      try {
        // Count based on is_active filter if provided
        const query = is_active !== undefined ? { is_active } : {}
        const count = await StockLocation.countDocuments(query)
        return {
          status: true,
          count,
          message: 'Stock location count retrieved successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
  Mutation: {
    addStockLocation: async (_, { stockLocationInput }) => {
      try {
        const newStockLocation = new StockLocation(stockLocationInput)
        const stockLocation = await newStockLocation.save()
        return {
          status: true,
          data: stockLocation,
          message: 'Stock location added successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    updateStockLocation: async (_, { id, stockLocationInput }) => {
      try {
        const stockLocation = await StockLocation.findByIdAndUpdate(
          id,
          stockLocationInput,
          { new: true }
        )
        if (!stockLocation) {
          return {
            status: false,
            data: null,
            message: 'Stock location not found',
          }
        }
        return {
          status: true,
          data: stockLocation,
          message: 'Stock location updated successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    deleteStockLocation: async (_, { id }) => {
      try {
        const stockLocation = await StockLocation.findByIdAndDelete(id)
        if (!stockLocation) {
          return {
            status: false,
            data: null,
            message: 'Stock location not found',
          }
        }
        return {
          status: true,
          data: null,
          message: 'Stock location deleted successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    archiveStockLocation: async (_, { id }) => {
      try {
        const stockLocation = await StockLocation.findByIdAndUpdate(
          id,
          { is_active: false },
          { new: true }
        )
        if (!stockLocation) {
          return {
            status: false,
            data: null,
            message: 'Stock location not found',
          }
        }
        return {
          status: true,
          data: stockLocation,
          message: 'Stock location archived successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
}

module.exports = { stockLocationResolver }
