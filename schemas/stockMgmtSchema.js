// stockMgmtSchema.js
const { gql } = require('apollo-server-express')

const stockMgmtSchema = gql`
  type StockMgmt {
    id: ID!
    product_id: Product!
    warehouse_id: Warehouse!
    stock_location_id: StockLocation!
    quantity: Int!
    createdAt: String
    updatedAt: String
  }

  input StockMgmtInput {
    product_id: ID!
    warehouse_id: ID!
    stock_location_id: ID!
    quantity: Int!
  }

  type StockMgmtResponse {
    status: Boolean!
    data: StockMgmt
    message: String
  }

  type StockMgmtListResponse {
    status: Boolean!
    data: [StockMgmt]
    message: String
  }

  type Query {
    getStock(id: ID!): StockMgmtResponse!
    listStock: StockMgmtListResponse!
  }

  type Mutation {
    addStock(stockInput: StockMgmtInput): StockMgmtResponse!
    updateStock(id: ID!, stockInput: StockMgmtInput): StockMgmtResponse!
    deleteStock(id: ID!): StockMgmtResponse!
  }
`

module.exports = { stockMgmtSchema }
