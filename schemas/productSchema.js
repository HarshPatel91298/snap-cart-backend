const { gql } = require("apollo-server-express");

const productSchema = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    cost_price: Float!
    price: Float!
    color: String
    brand_id: ID
    category_id: ID
    sub_category_id: ID
    display_image: ID 
    images: [ID]
    sku: String
    is_active: Boolean!
    created_at: String
    updated_at: String
  }

  input NewProductInput {
    name: String!
    description: String!
    cost_price: Float!
    price: Float!
    color: String
    brand_id: ID
    category_id: ID
    sub_category_id: ID
    display_image: ID
    images: [ID]
    sku: String
    is_active: Boolean
  }


  input UpdateProductInput {
    name: String
    description: String
    cost_price: Float
    price: Float
    color: String
    brand_id: ID
    category_id: ID
    sub_category_id: ID
    display_image: ID
    images: [ID]
    sku: String
    is_active: Boolean
  }

  type ProductResponse {
    status: Boolean!
    data: Product
    message: String!
  }

  type Query {
   products(
      id: ID
      category_id: ID
      sub_category_id: ID
      brand_id: ID
      sku: String
      is_active: Boolean
      cost_price: Float
      price: Float
      color: String
      search: String
    ): [Product!]!
    product(id: ID!): Product
    productCount: Int!
    getRandomProducts(limit: Int!): [Product]
  }

  type Mutation {
    addProduct(newProduct: NewProductInput!): ProductResponse!
    updateProduct(id: ID!, productData: UpdateProductInput!): ProductResponse!
    toggleProductStatusById(id: ID!): ProductResponse!
    deleteProduct(id: ID!): ProductResponse!
  }
`;

module.exports = { productSchema };
