// stockMgmtResolver.js
const StockMgmt = require('../models/stockMgmtModel')

const stockMgmtResolver = {
  Query: {
    getStock: async (_, { id }) => {
      try {
        const stock = await StockMgmt.findById(id)
        if (!stock) {
          return { status: false, data: null, message: 'Stock not found' }
        }
        return {
          status: true,
          data: stock,
          message: 'Stock retrieved successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    listStock: async () => {
      try {
        const stocks = await StockMgmt.find()
        return {
          status: true,
          data: stocks,
          message: 'Stock list retrieved successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
  Mutation: {
    addStock: async (_, { stockInput }) => {
      try {
        const newStock = new StockMgmt(stockInput)
        const stock = await newStock.save()
        return {
          status: true,
          data: stock,
          message: 'Stock added successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    updateStock: async (_, { id, stockInput }) => {
      try {
        const stock = await StockMgmt.findByIdAndUpdate(id, stockInput, {
          new: true,
        })
        if (!stock) {
          return { status: false, data: null, message: 'Stock not found' }
        }
        return {
          status: true,
          data: stock,
          message: 'Stock updated successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    deleteStock: async (_, { id }) => {
      try {
        const stock = await StockMgmt.findByIdAndDelete(id)
        if (!stock) {
          return { status: false, data: null, message: 'Stock not found' }
        }
        return {
          status: true,
          data: null,
          message: 'Stock deleted successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
}

module.exports = { stockMgmtResolver }
