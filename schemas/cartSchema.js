const { gql } = require("apollo-server-express");

const cartSchema = gql`
  type Product {
    id: ID!
    name: String
    price: Float
  }

  type CartItem {
    product_id: ID!
    quantity: Int!
    product: Product # Field to fetch additional product details
    price: Float! # Field to store the price of the product
  }

  type Cart {
    id: ID!
    user_id: ID!
    products: [CartItem]
    sub_total: Float!
    discount: Float!
    tax: Float # New field to represent applicable tax
    total_price: Float!
    coupon_id: ID # New field to reference an applied coupon
    is_active: Boolean! # Represents cart status
    created_at: String
    updated_at: String
  }

  input AddToCartInput {
    user_id: ID!
    products: [ProductInput!]!
  }

  input ProductInput {
    product_id: ID!
    quantity: Int!
  }

  input UpdateCartItemInput {
    user_id: ID!
    product_id: ID!
    quantity: Int!
  }

  type CartResponse {
    status: Boolean!
    data: Cart
    message: String!
  }

  type Query {
    cart: CartResponse
  }

  type Mutation {
    addToCart(input: AddToCartInput!): CartResponse!
    reduceCartItemQuantity(user_id: ID!, product_id: ID!, quantity: Int!): CartResponse!
    updateCartItem(input: UpdateCartItemInput!): CartResponse!
    removeCartItem(user_id: ID!, product_id: ID!): CartResponse!
    clearCart(user_id: ID!): CartResponse!
    closeCart(user_id: ID!): CartResponse!  
  }
`;

module.exports = { cartSchema };
