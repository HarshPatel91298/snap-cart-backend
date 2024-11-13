const { gql } = require('apollo-server-express')

const attachmentSchema = gql`
    type Attachment {
        id: ID!
        name: String!
        url: String!
        type: String!
        created_at: String
        updated_at: String
    }
    
    input NewAttachmentInput {
        name: String!
        url: String!
        type: String!
    }
    
    type AttachmentResponse {
        status: Boolean!
        data: Attachment
        message: String!
    }
    
    type AttachmentListResponse {
        status: Boolean!
        data: [Attachment]
        message: String!
    }
    
    type Query {
        attachments: AttachmentListResponse!
        attachmentById(id: ID!): AttachmentResponse!
    }
    
    type Mutation {
        addAttachment(attachmentInput: NewAttachmentInput!): AttachmentResponse!
        updateAttachment(id: ID!, attachmentInput: NewAttachmentInput!): AttachmentResponse!
        deleteAttachment(id: ID!): AttachmentResponse!
    }
    `

module.exports = { attachmentSchema }