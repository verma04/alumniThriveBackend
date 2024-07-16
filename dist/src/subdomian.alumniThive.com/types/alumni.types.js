"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const alumniTypes = (0, apollo_server_core_1.gql) `
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
`;
exports.alumniTypes = alumniTypes;
