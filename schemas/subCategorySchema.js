const { gql } = require('apollo-server-express');

const subCategorySchema = gql`
    type SubCategory {
        id: ID!
        name: String!
        description: String
        is_active: Boolean
        createdAt: String!
        updatedAt: String!
        category_id: ID!
    }
    
    input NewSubCategoryInput {
        name: String!
        description: String
        category_id: ID!
    }
    
    input UpdateSubCategoryInput {
        name: String
        description: String
        category_id: ID
    }
    
    type SubCategoryResponse {
        status: Boolean
        data: SubCategory
        message: String!
    }
    
    type Query {
        subCategories: [SubCategory]
        subCategoryById(id: ID!): SubCategoryResponse!
    }

    type Mutation {
        createSubCategory(newSubCategory: NewSubCategoryInput!): SubCategoryResponse!
        updateSubCategory(id: ID!, subCategoryData: UpdateSubCategoryInput!): SubCategoryResponse!
        toggleSubCategoryStatusById(id: ID!): SubCategoryResponse!
        deleteSubCategoryById(id: ID!): SubCategoryResponse!
    }
`;

module.exports = {subCategorySchema};