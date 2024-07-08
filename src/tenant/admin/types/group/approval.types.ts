import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking')
const approvalTypes = gql`
    type Interests {
        id: ID
        title: String
        createdAt: Date
        updatedAt: Date
    }

    type group {
        id: String
        slug: String
        title: String
        creator: String
        organization: String
        cover: String
        isApproved: Boolean
        isBlocked: Boolean
        isPaused: Boolean
        isActive: Boolean
        about: String
        createdAt: Date
        updatedAt: Date
        setting: setting
        theme: theme
        interest: interest
    }

    type theme {
        title: String
    }

    type interest {
        title: String
    }
    type setting {
        groupType: String
        joiningCondition: String
        privacy: String
    }
    input groupStatus {
        all: Boolean
        isApproved: Boolean
        isBlocked: Boolean
        isFeatured: Boolean
    }
    type Query {
        getAllGroupStatus(input: groupStatus!): [group]
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
    input inputFeaturedGroup {
        id: ID!
    }
    type Mutation {
        addGroupInterests(input: addInterests): [Interests]
        deleteGroupInterests(input: deleteInterests): Interests
        duplicateGroupInterests(input: duplicateInterests): [Interests]
        editGroupInterests(input: editInterests): Interests
        addFeaturedGroup(input: [String]): group
    }
`

export { approvalTypes }
