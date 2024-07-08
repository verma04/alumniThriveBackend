import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking')
const themeTypes = gql`
    type theme {
        id: ID
        title: String
        createdAt: Date
        updatedAt: Date
    }
    type Query {
        getAllGroupTheme: [theme]
    }

    input addTheme {
        title: String!
    }
    input deleteTheme {
        id: ID!
    }
    input duplicateTheme {
        id: ID!
    }
    input editTheme {
        id: ID!
        title: String!
    }
    type Mutation {
        addGroupTheme(input: addTheme): [theme]
        deleteGroupTheme(input: deleteTheme): theme
        duplicateGroupTheme(input: duplicateTheme): [theme]
        editGroupTheme(input: editTheme): theme
    }
`

export { themeTypes }
