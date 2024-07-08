import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const profileTypes = gql`
    type Query {
        getProfileTag: [String]
    }

    input profileTag {
        tag: [String]
    }
    type Mutation {
        editProfileTag(input: profileTag): [String]
    }
`

export { profileTypes }
