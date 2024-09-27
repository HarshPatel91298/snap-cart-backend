const { gql } = require('apollo-server-express'); // Apollo's gql import

const userSchema = gql`
  type User {
    id: ID!
    email: String!
    displayName: String
    firebaseUID: String!
    photoURL: String
    emailVerified: Boolean!
    phoneNumber: String
    createdAt: String!
    creationTime: String!
    lastLoginAt: String!
    lastSignInTime: String!
  }

  
  input NewUserInput {
    email: String!
    displayName: String
    firebaseUID: String!
    photoURL: String
    emailVerified: Boolean!
    phoneNumber: String
    createdAt: String!
    creationTime: String!
    lastLoginAt: String!
    lastSignInTime: String!
    }

  input UpdateUserInput {
    displayName: String
    photoURL: String
    emailVerified: Boolean
    phoneNumber: String
    }

    type UserResponse {
        data: User
        message: String
    }
    
    type Query {
        userByEmail(email: String!): UserResponse!
    }
  type Mutation {
    createUser(newUser: NewUserInput!): UserResponse!
    updateUser(uid: String!, userData: UpdateUserInput!): UserResponse!
  }
`;

module.exports = { userSchema };
