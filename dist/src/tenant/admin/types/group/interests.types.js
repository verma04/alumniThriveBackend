"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interestsTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking')
const interestsTypes = (0, apollo_server_core_1.gql) `
    type Interests {
        id: ID
        title: String
        createdAt: Date
        updatedAt: Date
    }
    type Query {
        getAllGroupInterests: [Interests]
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
    type Mutation {
        addGroupInterests(input: addInterests): [Interests]
        deleteGroupInterests(input: deleteInterests): Interests
        duplicateGroupInterests(input: duplicateInterests): [Interests]
        editGroupInterests(input: editInterests): Interests
    }
`;
exports.interestsTypes = interestsTypes;
