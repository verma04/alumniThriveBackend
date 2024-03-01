import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const organizationTypes = gql`
  scalar Upload
  type Book {
    title: String
    author: String
  }
  type success {
    success: Boolean
  }

  type token {
    id: ID
  }
  type jwtToken {
    token: String
  }

  type organizationTheme {
    colorPrimary: String
    borderRadius: String
    colorBgContainer: String
  }
  type Organization {
    organizationName: String
    logo: String
    theme: organizationTheme
  }

  type user {
    id: String
    email: String
    firstName: String
    lastName: String
    isApproved: Boolean
    isRequested: Boolean
    avatar: String
    aboutAlumni: aboutAlumni
  }
  type Query {
    checkDomain(domain: String): Organization
    getUser: user
  }

  input kyc {
    affliction: [String]!
    referralSource: [String]!
    comment: String!
    agreement: Boolean!
    identificationNumber: String
  }
  type Mutation {
    completeKyc(input: kyc): success
  }
`;

export { organizationTypes };
