"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const profileTypes = (0, apollo_server_core_1.gql) `
    type Query {
        getProfileTag: [String]
    }

    input profileTag {
        tag: [String]
    }
    type Mutation {
        editProfileTag(input: profileTag): [String]
    }
`;
exports.profileTypes = profileTypes;
