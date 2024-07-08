import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const adminTypes = gql`
    type Book {
        title: String
        author: String
    }
    type success {
        success: Boolean
    }

    type token {
        id: ID
        status: Boolean
    }
    type jwtToken {
        token: String
    }
    type profile {
        email: String
        firstName: String
        lastName: String
    }
    type getUser {
        id: ID
        status: Boolean
    }
    type user {
        id: ID
        firstName: String
        lastName: String
        organization: organization
        email: String
    }
    type organization {
        id: ID
        address: String
        category: String
        organizationName: String
        timeZone: String
        logo: String
        website: String
    }
    type Query {
        getUser: getUser
        userProfile: profile
    }

    input registerInput {
        firstName: String!
        lastName: String!
        password: String!
        email: String!
        confirm: String
    }
    input loginInput {
        password: String!
        email: String!
    }
    input otpInput {
        id: ID!
        otp: String!
    }
    type Mutation {
        logoutUser: success
        logoutUserAllDevices: success
        loginAsAdmin(input: loginInput): token
        otpLogin(input: otpInput): jwtToken
        registerAsAdmin(input: registerInput): success
        registerOrganization: success
    }
`

export { adminTypes }
