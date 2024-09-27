const { gql } = require('apollo-server-express'); // Apollo's gql import

const brandSchema = gql`
    type Brand {
        id: ID!
        name: String!
        description: String
        is_active: Boolean
        logoURL: String
        createdAt: String!
        updatedAt: String!
    }
    
    input NewBrandInput {
        name: String!
        description: String
        logoURL: String
    }
    
    input UpdateBrandInput {
        name: String
        description: String
        logoURL: String
    }

    type BrandResponse {
        status: Boolean
        data: Brand
        message: String!
    }

        
    type Query {
        brands: [Brand]
        brandById(id: ID!): BrandResponse!
    }
    type Mutation {
        createBrand(newBrand: NewBrandInput!): BrandResponse!
        updateBrand(id: ID!, brandData: UpdateBrandInput!): BrandResponse!
        toggleBrandStatusById(id: ID!): BrandResponse!
        deleteBrandById(id: ID!): BrandResponse!
    }
    `;

module.exports = { brandSchema };