// warehouseResolver.js
const Warehouse = require('../models/warehouseModel')

const warehouseResolver = {
  Query: {
    getWarehouse: async (_, { id }) => {
      try {
        const warehouse = await Warehouse.findById(id)
        if (!warehouse) {
          return { status: false, data: null, message: 'Warehouse not found' }
        }
        return {
          status: true,
          data: warehouse,
          message: 'Warehouse retrieved successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    listWarehouses: async () => {
      try {
        const warehouses = await Warehouse.find()
        return {
          status: true,
          data: warehouses,
          message: 'Warehouse list retrieved successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
  Mutation: {
    addWarehouse: async (_, { warehouseInput }) => {
      try {
        const newWarehouse = new Warehouse(warehouseInput)
        const warehouse = await newWarehouse.save()
        return {
          status: true,
          data: warehouse,
          message: 'Warehouse added successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    updateWarehouse: async (_, { id, warehouseInput }) => {
      try {
        const warehouse = await Warehouse.findByIdAndUpdate(
          id,
          warehouseInput,
          { new: true }
        )
        if (!warehouse) {
          return { status: false, data: null, message: 'Warehouse not found' }
        }
        return {
          status: true,
          data: warehouse,
          message: 'Warehouse updated successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    deleteWarehouse: async (_, { id }) => {
      try {
        const warehouse = await Warehouse.findByIdAndDelete(id)
        if (!warehouse) {
          return { status: false, data: null, message: 'Warehouse not found' }
        }
        return {
          status: true,
          data: null,
          message: 'Warehouse deleted successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    archiveWarehouse: async (_, { id }) => {
      try {
        const warehouse = await Warehouse.findByIdAndUpdate(
          id,
          { is_active: false },
          { new: true }
        )
        if (!warehouse) {
          return { status: false, data: null, message: 'Warehouse not found' }
        }
        return {
          status: true,
          data: warehouse,
          message: 'Warehouse archived successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
}

module.exports = { warehouseResolver }
