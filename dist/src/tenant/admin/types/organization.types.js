"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const organizationTypes = (0, apollo_server_core_1.gql) `
    scalar Upload
    type Book {
        title: String
        author: String
    }
    type success {
        success: Boolean
    }

    type currency {
        id: ID
        name: String
        symbol: String
        cc: String
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
        getCurrency: [currency]
        getOrganization: user
        checkDomain(input: domainQuery): success
        getOrganizationCurrency: currency
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
    input inputCurrency {
        id: ID
    }

    type Mutation {
        registerOrganization(input: registerOrganizationInput): success
        changeThemeColor(input: InputTheme): organizationTheme
        updateCurrency(input: inputCurrency): currency
    }
`;
exports.organizationTypes = organizationTypes;
