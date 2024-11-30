const { gql } = require('apollo-server-express');

const addressSchema = gql`
  type Address {
    id: ID!
    userId: ID!
    name: String
    street: String!
    apartment: String
    city: String!
    province: String!
    postalCode: String!
    country: String!
    poBox: String
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
    country: String
    poBox: String
    phone: String
    isDefault: Boolean
  }

  input UpdateAddressInput {
    name: String
    street: String
    apartment: String
    city: String
    province: String
    postalCode: String
    country: String
    poBox: String
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
    totalCount: Int
    message: String
  }

  type Query {
    addresses(limit: Int, offset: Int): AddressListResponse!
    addressById(id: ID!): AddressResponse!
  }

  type Mutation {
    addAddress(addressInput: AddressInput): AddressResponse!
    updateAddress(id: ID!, addressInput: UpdateAddressInput): AddressResponse!
    deleteAddress(id: ID!): AddressResponse!
    toggleDefaultStatus(id: ID!): AddressResponse!
  }
`;

module.exports = { addressSchema };
