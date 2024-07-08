import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const issuesTypes = gql`
    input inputGetIssues {
        sort: String
        search: String
        offset: Int
        limit: Int
    }
    type allIssues {
        totalRecords: Int
        data: [issue]
    }
    input getBySlug {
        id: ID!
    }
    type Query {
        getIssueComment(input: getFeedInput!): [feedComment]
        getIssues(input: inputGetIssues): allIssues
        getIssueBySlug(input: getBySlug!): issue
    }

    type issue {
        id: ID
        visibility: String
        title: String
        summary: String
        page: String
        details: String
        module: String
        feature: String
        ticket: String
        type: String
        status: String
        createdAt: Date
        user: issUser
    }
    type issUser {
        id: ID
        firstName: String
        lastName: String
    }

    input createIssue {
        id: ID
        visibility: String!
        title: String!
        summary: String
        page: String
        details: String
        module: String!
        feature: String
        type: String!
    }

    type Mutation {
        addIssueComment(input: inputFeedComment!): [feedComment]
        createIssue(input: createIssue): [issue]
    }
`

export { issuesTypes }
