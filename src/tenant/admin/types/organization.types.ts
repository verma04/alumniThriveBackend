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
  type Query {
    books: [Book]
  }
  input registerOrganizationInput {
    organizationName: String!
    category: String!
    designation: String!
    phone: String!
    website: String!
    timeZone: String!
    language: String!
    address: String!
    logo: Upload
    domain: String!
    phonePrefix: String!
    agreement: Boolean
  }
  input domainQuery {
    domain: String!
  }
  type Query {
    getOrganization: user
    checkDomain(input: domainQuery): success
  }
  type organizationTheme {
    colorPrimary: String
    borderRadius: String
    colorBgContainer: String
  }
  type inputTheme {
    colorPrimary: String
    borderRadius: String
    colorBgContainer: String
  }
  input InputTheme {
    colorPrimary: String
    borderRadius: Int
    colorBgContainer: String
  }

  type Mutation {
    registerOrganization(input: registerOrganizationInput): success
    changeThemeColor(input: InputTheme): organizationTheme
  }
`;

export { organizationTypes };
