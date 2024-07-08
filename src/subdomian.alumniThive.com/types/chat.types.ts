import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const chatTypes = gql`
    scalar Upload

    type Subscription {
        numberIncremented: Int
    }
    # input kyc {
    #   affliction: [String]!
    #   referralSource: [String]!
    #   comment: String!
    #   agreement: Boolean!
    #   identificationNumber: String
    # }
`

export { chatTypes }
