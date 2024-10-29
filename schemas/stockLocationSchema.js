// stockLocationSchema.js
const { gql } = require('apollo-server-express')

const stockLocationSchema = gql`
  type StockLocation {
    id: ID!
    name: String!
    warehouse_id: ID!
    is_active: Boolean!
    createdAt: String
    updatedAt: String
  }

  input StockLocationInput {
    name: String!
    warehouse_id: ID!
    is_active: Boolean
  }

  type StockLocationResponse {
    status: Boolean!
    data: StockLocation
    message: String
  }

  type StockLocationListResponse {
    status: Boolean!
    data: [StockLocation]
    message: String
  }

  type StockLocationCountResponse {
    status: Boolean!
    count: Int
    message: String
  }

  type Query {
    getStockLocation(id: ID!): StockLocationResponse!
    listStockLocations: StockLocationListResponse!
    getStockLocationCount(is_active: Boolean): StockLocationCountResponse! # New query for getting the count
  }

  type Mutation {
    addStockLocation(
      stockLocationInput: StockLocationInput
    ): StockLocationResponse!
    updateStockLocation(
      id: ID!
      stockLocationInput: StockLocationInput
    ): StockLocationResponse!
    deleteStockLocation(id: ID!): StockLocationResponse!
    archiveStockLocation(id: ID!): StockLocationResponse!
  }
`

module.exports = { stockLocationSchema }
