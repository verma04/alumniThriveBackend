import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const faqTypes = gql`
    scalar Upload
    scalar Date

    type faq {
        id: ID
        title: String
        description: String
        createdAt: Date
        updatedAt: Date
        sort: Int
    }
    input inputFaq {
        module: String
    }
    type Query {
        getModuleFaq(input: inputFaq): [faq]
    }

    input fundCampaignInput {
        action: LocationType!
        ID: ID!
    }
    input inputDeleteFaq {
        id: ID!
    }
    input editDeleteFaq {
        id: ID!
    }
    input inputEditFaq {
        id: ID!
        title: String
        description: String
    }
    input inputAddFaq {
        title: String
        description: String
        module: String
    }
    input sortInputFaq {
        id: ID
        sort: Int
    }

    type Mutation {
        addFaq(input: inputAddFaq): [faq]
        editFaq(input: inputEditFaq): [faq]
        deleteFaq(input: inputDeleteFaq): faq
        sortFaq(input: [sortInputFaq]): faq
    }
`

export { faqTypes }
