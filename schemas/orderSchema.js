const { gql } = require('apollo-server-express');



const orderSchema = gql`

  type User {
    id: ID!
    email: String!
    displayName: String!
  }


  type OrderLine {
    id: ID!
    product_id: ID!
    quantity: Int!
    price: Float!
    created_at: String
    updated_at: String
  }


  type Order {
    id: ID!
    user_id: User! 
    cart_id: ID
    order_number: String!
    order_status: String!
    order_date: String
    orderLines: [OrderLine] # Use the newly defined type here
    total_amount: Float!
    payment_method: String!
    address_id: Address!
    created_at: String
    updated_at: String
  }

  input CreateOrderInput {
    cart_id: ID
    payment_method: String!
    address_id: ID!
  }

  input UpdateOrderStatusInput {
    orderId: ID!
    order_status: String!
  }

  type OrderResponse {
    status: Boolean!
    data: [Order]
    message: String!
  }

  type SingleOrderResponse {
    status: Boolean!
    data: Order
    message: String!
  }

  type Query {
    getOrders(created_at: String, order_status: String): OrderResponse
    getOrderByID(order_id: ID!): SingleOrderResponse
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(input: UpdateOrderStatusInput!): Order!
  }
`;

module.exports = { orderSchema };
