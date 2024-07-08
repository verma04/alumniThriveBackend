import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const alumniTypes = gql`
    scalar Upload

    type connection {
        id: ID
        firstName: String
        lastName: String
        avatar: String
        aboutAlumni: aboutAlumni
        isAdded: Boolean
    }
    input idInput {
        id: ID!
    }
    type Query {
        getAllConnection(input: idInput): [connection]
        getAllOrganizationUser: [connection]
    }

    # input kyc {
    #   affliction: [String]!
    #   referralSource: [String]!
    #   comment: String!
    #   agreement: Boolean!
    #   identificationNumber: String
    # }
`

export { alumniTypes }
