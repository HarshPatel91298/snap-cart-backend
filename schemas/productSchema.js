const { gql } = require("apollo-server-express");

const productSchema = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    color: String
    brand_id: ID
    category_id: ID
    sub_category_id: ID
    display_image: String
    images: [String]
    stock: Int!
    sku: String
    is_active: Boolean!
    created_at: String
    updated_at: String
  }

  input NewProductInput {
    name: String!
    description: String!
    price: Float!
    color: String
    brand_id: ID
    category_id: ID
    sub_category_id: ID
    display_image: String
    images: [String]
    stock: Int!
    sku: String
    is_active: Boolean
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    color: String
    brand_id: ID
    category_id: ID
    sub_category_id: ID
    display_image: String
    images: [String]
    stock: Int
    sku: String
    is_active: Boolean
  }

  type ProductResponse {
    status: Boolean!
    data: Product
    message: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    productCount: Int!
  }

  type Mutation {
    addProduct(newProduct: NewProductInput!): ProductResponse!
    updateProduct(id: ID!, productData: UpdateProductInput!): ProductResponse!
    toggleProductStatusById(id: ID!): ProductResponse!
    deleteProduct(id: ID!): ProductResponse!
  }
`;

module.exports = { productSchema };
