const StockMgmt = require("../models/stockMgmtModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth");

const stockMgmtResolver = {
  Query: {
    getStock: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "stock");

      try {
        const stock = await StockMgmt.fetchStocks();
        if (!stock) {
          throw new ForbiddenError("Stock not found");
        }
        return {
          status: true,
          data: stock,
          message: "Stock retrieved successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    listStock: async (_, {}, context) => {
      // console.log(context);
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "stock");

      try {
        const stocks = await StockMgmt.fetchStocks();

        return {
          status: true,
          data: stocks,
          message: "Stock list retrieved successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    addStock: async (_, { stockInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "stock");

      try {
        const newStock = await StockMgmt.createStock(stockInput);
        console.log("Created stock", newStock);
        return {
          status: true,
          data: newStock,
          message: "Stock added successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateStock: async (_, { id, stockInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "stock");

      try {
        const stock = await StockMgmt.updateStock(id, stockInput);
      
        return {
          status: true,
          data: stock,
          message: "Stock updated successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteStock: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "stock");

      try {
        const stock = await StockMgmt.findByIdAndDelete(id);
        if (!stock) {
          throw new ForbiddenError("Stock not found");
        }
        return {
          status: true,
          data: null,
          message: "Stock deleted successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = { stockMgmtResolver };
