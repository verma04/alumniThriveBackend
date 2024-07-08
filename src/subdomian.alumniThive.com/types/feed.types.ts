import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const feedTypes = gql`
    input getFeedInput {
        id: ID
    }
    type feedComment {
        content: String
        id: String
        createdAt: Date
        user: users
    }
    type users {
        id: ID
        alumni: alumniProfile
    }
    type alumniProfile {
        fistName: String
        lastName: String
        avatar: String
        id: ID
    }
    type Query {
        getFeedComment(input: getFeedInput!): [feedComment]
        getGroupFeed(input: typeid!): [feed]
        getGroupFeed(input: typeid!): [feed]
        getAllAlumniFeed(input: typeid!): [feed]
        getAllUserFeed: [feed]
        getGroupFeedByUser: [feed]
    }

    input inputFeedComment {
        feedId: ID
        content: String
        id: ID
    }
    input typeid {
        id: ID!
        offset: Int
    }
    type feed {
        id: ID
        description: String
        user: alumni
        createdAt: Date
        group: group
        reactions: [reactions]
        media: [media]
        feedForm: String
        job: String
    }

    type Mutation {
        addFeedComment(input: inputFeedComment!): [feedComment]
    }
`

export { feedTypes }
