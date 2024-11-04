const { gql } = require('apollo-server-express');

const orderSchema = gql`
  # OrderLine type
  type OrderLine {
    id: ID!
    order_id: ID!
    product_id: ID!
    quantity: Int!
    price: Float!
    created_at: String
    updated_at: String
  }

  # Order type
  type Order {
    id: ID!
    user_id: ID!
    order_status: String!
    order_date: String
    orderLines: [OrderLine]
    total_amount: Float!
    payment_method: String!
    address_id: ID!
    created_at: String
    updated_at: String
  }

  # Input for creating OrderLine
  input OrderLineInput {
    product_id: ID!
    quantity: Int!
    price: Float!
  }

  # Input for creating an Order
  input CreateOrderInput {
    user_id: ID!
    order_status: String!
    total_amount: Float!
    payment_method: String!
    address_id: ID!
    orderLines: [OrderLineInput!]!
  }

  # Input for updating an order status
  input UpdateOrderStatusInput {
    orderId: ID!
    order_status: String!
  }

  # Query type definitions
  type Query {
    getOrders(user_id: ID, created_at: String, order_status: String): [Order]
    getOrder(id: ID!): Order
  }

  # Mutation type definitions
  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(input: UpdateOrderStatusInput!): Order!
  }
`;

module.exports = {orderSchema};
