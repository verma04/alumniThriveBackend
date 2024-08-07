import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const marketPlaceTypes = gql`
    scalar Upload

    type postedUser {
        id: ID
    }

    type postedBy {
        alumni: postedUser
    }
    type MarketPlace {
        id: ID
        brand: String
        category: String
        condition: String
        description: String
        price: String
        sku: String
        title: String
        images: [images]
        location: String
        createdAt: Date
        currency: String
        postedBy: postedBy
    }
    type images {
        url: String
    }
    type jobTag {
        tag: String
    }

    # input kyc {
    #   affliction: [String]!
    #   referralSource: [String]!
    #   comment: String!
    #   agreement: Boolean!
    #   identificationNumber: String
    # }
    input marketPlace {
        brand: String
        category: String!
        condition: String!
        description: String!
        price: String!
        sku: String
        title: String!
        location: String!
        images: [Upload]
        currency: String!
    }
    input jobTagInput {
        tag: String
    }
    input inputID {
        id: ID!
    }
    input inputSlug {
        slug: String!
    }

    input contactInput {
        listingId: ID!
        userId: ID!
    }

    type Mutation {
        postListing(input: marketPlace): [MarketPlace]
        contactMarketPlace(input: contactInput): chat
    }
    type Query {
        getAllMarketPlaceListing: [MarketPlace]
    }
`

export { marketPlaceTypes }
