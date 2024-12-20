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
    userRole: String!
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
    email: String
    }

    type UserResponse {
        status: Boolean!
        data: User
        message: String
    }
    
    type Query {
        users: [User]
        userByEmail(email: String!): UserResponse!
        userByUID(uid: String!): UserResponse!
        getAdmins: [User]
    }

   input AdminCreationInput {
      firstName: String!
      lastName: String!
      email: String!
      phoneNumber: String!
      binaryImage: String
    }

  type Mutation {
    createUser(newUser: NewUserInput!): UserResponse!
    createAdminUser(adminData: AdminCreationInput!): UserResponse!
    updateUser(uid: String!, userData: UpdateUserInput!): UserResponse!
    deleteUserById(uid: String!): UserResponse!
    makeAdmin(uid: String!): UserResponse!
    removeAdmin(uid: String!): UserResponse!
    makeUser(uid: String!): UserResponse!
  }
`;

module.exports = { userSchema };
