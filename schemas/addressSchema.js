// addressSchema.js
const { gql } = require('apollo-server-express')

const addressSchema = gql`
  type Address {
    id: ID!
    name: String
    street: String!
    apartment: String
    city: String!
    province: String!
    postalCode: String!
    country: String!
    phone: String
    isDefault: Boolean
    createdAt: String
    updatedAt: String
  }

  input AddressInput {
    name: String
    street: String!
    apartment: String
    city: String!
    province: String!
    postalCode: String!
    country: String!
    phone: String
    isDefault: Boolean
  }

  type AddressResponse {
    status: Boolean!
    data: Address
    message: String
  }

  type AddressListResponse {
    status: Boolean!
    data: [Address]
    message: String
  }

  type Query {
    addresses: AddressListResponse!
    addressById(id: ID!): AddressResponse!
  }

  type Mutation {
    addAddress(addressInput: AddressInput): AddressResponse!
    updateAddress(id: ID!, addressInput: AddressInput): AddressResponse!
    deleteAddress(id: ID!): AddressResponse!
    toggleDefaultStatus(id: ID!): AddressResponse!
  }
`

module.exports = { addressSchema }

