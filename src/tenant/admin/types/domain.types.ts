import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking')
const domainTypes = gql`
    type domain {
        domain: String
        dnsConfig: Boolean
        ssl: Boolean
        status: Boolean
        organization: ID
    }
    type Query {
        getCustomDomain: domain
        checkDomainIsVerified: domain
    }
    input inputDomain {
        domain: String!
    }
    type Mutation {
        deleteDomain: domain
        updateDomain(input: inputDomain): domain
    }
`

export { domainTypes }
