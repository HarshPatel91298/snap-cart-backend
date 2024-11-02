const { gql } = require("apollo-server-express");

const cartSchema = gql`
  type Product {
    id: ID!
    name: String
    price: Float
    # Add other fields if needed
  }

  type CartItem {
    product_id: ID!
    quantity: Int!
    product: Product # Field to fetch additional product details
  }

  type Cart {
    id: ID!
    user_id: ID!
    products: [CartItem]
    total_price: Float!
    created_at: String
    updated_at: String
  }

  input AddToCartInput {
    user_id: ID!
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
    cart(user_id: ID!): Cart
  }

  type Mutation {
    addToCart(input: AddToCartInput!): CartResponse!
    updateCartItem(input: UpdateCartItemInput!): CartResponse!
    removeCartItem(user_id: ID!, product_id: ID!): CartResponse!
    clearCart(user_id: ID!): CartResponse!
  }
`;

module.exports = { cartSchema };
