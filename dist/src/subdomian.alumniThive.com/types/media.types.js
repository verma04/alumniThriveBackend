"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const mediaTypes = (0, apollo_server_core_1.gql) `
    scalar Upload
    scalar Date

    type media {
        url: String
        id: ID
    }
    input typeMedia {
        group: ID!
        offset: Int
    }
    type Query {
        getMediaByGroup(input: typeMedia!): [media]
    }
    #   type Mutation {
    #     createEventForGroup(input: addEvent): event
    #   }
`;
exports.mediaTypes = mediaTypes;
