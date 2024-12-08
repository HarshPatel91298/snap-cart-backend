const { gql } = require('apollo-server-express')

const paymentSchema = gql`

    input ItemInput {
        cart_id: String!
    }
    
    type PaymentIntentResponse {
        clientSecret: String!
        dpmCheckerLink: String!
    }

    type Mutation {
        createPaymentIntent(items: [ItemInput!]!): PaymentIntentResponse!
    }
`

module.exports = {paymentSchema}