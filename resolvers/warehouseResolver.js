const Warehouse = require("../models/warehouseModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth");

const warehouseResolver = {
  Query: {
    getWarehouse: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "warehouse");

      try {
        const warehouse = await Warehouse.findById(id);
        if (!warehouse) {
          throw new ForbiddenError("Warehouse not found");
        }
        return {
          status: true,
          data: warehouse,
          message: "Warehouse retrieved successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    listWarehouses: async (_, {}, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "warehouse");

      try {
        const warehouses = await Warehouse.find();
        return {
          status: true,
          data: warehouses,
          message: "Warehouse list retrieved successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    addWarehouse: async (_, { warehouseInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "warehouse");

      try {
        const newWarehouse = new Warehouse(warehouseInput);
        const warehouse = await newWarehouse.save();
        return {
          status: true,
          data: warehouse,
          message: "Warehouse added successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateWarehouse: async (_, { id, warehouseInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "warehouse");

      try {
        const warehouse = await Warehouse.findByIdAndUpdate(
          id,
          warehouseInput,
          { new: true }
        );
        if (!warehouse) {
          throw new ForbiddenError("Warehouse not found");
        }
        return {
          status: true,
          data: warehouse,
          message: "Warehouse updated successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteWarehouse: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "warehouse");

      try {
        const warehouse = await Warehouse.findByIdAndDelete(id);
        if (!warehouse) {
          throw new ForbiddenError("Warehouse not found");
        }
        return {
          status: true,
          data: null,
          message: "Warehouse deleted successfully",
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    toggleWarehouse: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "warehouse");

      try {
        // Find the current status of the warehouse
        const warehouse = await Warehouse.findById(id);
        if (!warehouse) {
          throw new ForbiddenError("Warehouse not found");
        }

        warehouse.is_active = !warehouse.is_active;
        await warehouse.save();

        return {
          status: true,
          data: warehouse,
          message: `Warehouse ${
            warehouse.is_active ? "activated" : "archived"
          } successfully`,
        };
      } catch (error) {
        throw new Error("Failed to toggle warehouse status: " + error.message);
      }
    },
  },
};

module.exports = { warehouseResolver };
