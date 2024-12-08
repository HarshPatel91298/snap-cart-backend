const StockLocation = require("../models/stockLocationModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth");

const stockLocationResolver = {
  Query: {
    getStockLocation: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "stockLocation");

      try {
        const stockLocation = await StockLocation.findById(id);
        if (!stockLocation) {
          throw new ForbiddenError("Stock location not found");
        }
        return {
          status: true,
          data: stockLocation,
          message: "Stock location retrieved successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    listStockLocations: async (_, {}, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "stockLocation");

      try {
        const stockLocations = await StockLocation.find();
        return {
          status: true,
          data: stockLocations,
          message: "Stock location list retrieved successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getStockLocationCount: async (_, { is_active }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "stockLocation");

      try {
        const query = is_active !== undefined ? { is_active } : {};
        const count = await StockLocation.countDocuments(query);
        return {
          status: true,
          data: count,
          message: "Stock location count retrieved successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    addStockLocation: async (_, { stockLocationInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "stockLocation");

      try {
        const newStockLocation = new StockLocation(stockLocationInput);
        const stockLocation = await newStockLocation.save();
        return {
          status: true,
          data: stockLocation,
          message: "Stock location added successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateStockLocation: async (_, { id, stockLocationInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "stockLocation");

      try {
        const stockLocation = await StockLocation.findByIdAndUpdate(
          id,
          stockLocationInput,
          { new: true }
        );
        if (!stockLocation) {
          throw new ForbiddenError("Stock location not found");
        }
        return {
          status: true,
          data: stockLocation,
          message: "Stock location updated successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteStockLocation: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "stockLocation");

      try {
        const stockLocation = await StockLocation.findByIdAndDelete(id);
        if (!stockLocation) {
          throw new ForbiddenError("Stock location not found");
        }
        return {
          status: true,
          data: null,
          message: "Stock location deleted successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    toggleStockLocation: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "stockLocation");

      try {
        const stockLocation = await StockLocation.findByIdAndUpdate(
          id,
          { is_active: false },
          { new: true }
        );
        if (!stockLocation) {
          throw new ForbiddenError("Stock location not found");
        }
        return {
          status: true,
          data: stockLocation,
          message: "Stock location archived successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = { stockLocationResolver };
