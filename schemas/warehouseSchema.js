// warehouseSchema.js
const { gql } = require('apollo-server-express')

const warehouseSchema = gql`
  type Warehouse {
    id: ID!
    name: String!
    location: String!
    is_active: Boolean!
    createdAt: String
    updatedAt: String
  }

  input WarehouseInput {
    name: String!
    location: String!
    is_active: Boolean
  }

  type WarehouseResponse {
    status: Boolean!
    data: Warehouse
    message: String
  }

  type WarehouseListResponse {
    status: Boolean!
    data: [Warehouse]
    message: String
  }

  type Query {
    getWarehouse(id: ID!): WarehouseResponse!
    listWarehouses: WarehouseListResponse!
  }

  type Mutation {
    addWarehouse(warehouseInput: WarehouseInput): WarehouseResponse!
    updateWarehouse(id: ID!, warehouseInput: WarehouseInput): WarehouseResponse!
    deleteWarehouse(id: ID!): WarehouseResponse!
    archiveWarehouse(id: ID!): WarehouseResponse!
  }
`

module.exports = { warehouseSchema }
