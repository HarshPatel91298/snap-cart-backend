const { gql } = require('apollo-server-express');

const categorySchema = gql`
    type Category {
        id: ID!
        name: String!
        description: String
        is_active: Boolean
        createdAt: String!
        updatedAt: String!
    }
    
    input NewCategoryInput {
        name: String!
        description: String
    }

    input UpdateCategoryInput {
        name: String
        description: String
    }

    type CategoryResponse {
        status: Boolean
        data: Category
        message: String!
    }



    type Query {
        categories: [Category]
        categoryById(id: ID!): CategoryResponse!
    }

    type Mutation {
        createCategory(newCategory: NewCategoryInput!): CategoryResponse!
        updateCategory(id: ID!, categoryData: UpdateCategoryInput!): CategoryResponse!
        toggleCategoryStatusById(id: ID!): CategoryResponse!
        deleteCategoryById(id: ID!): CategoryResponse!
    }
    
`;

module.exports = { categorySchema };