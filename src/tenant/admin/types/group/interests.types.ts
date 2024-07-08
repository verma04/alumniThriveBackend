import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking')
const interestsTypes = gql`
    type Interests {
        id: ID
        title: String
        createdAt: Date
        updatedAt: Date
    }
    type Query {
        getAllGroupInterests: [Interests]
    }

    input addInterests {
        title: String!
    }
    input deleteInterests {
        id: ID!
    }
    input duplicateInterests {
        id: ID!
    }
    input editInterests {
        id: ID!
        title: String!
    }
    type Mutation {
        addGroupInterests(input: addInterests): [Interests]
        deleteGroupInterests(input: deleteInterests): Interests
        duplicateGroupInterests(input: duplicateInterests): [Interests]
        editGroupInterests(input: editInterests): Interests
    }
`

export { interestsTypes }
