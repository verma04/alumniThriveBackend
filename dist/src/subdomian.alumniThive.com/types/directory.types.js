"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directoryTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const directoryTypes = (0, apollo_server_core_1.gql) `
    scalar Upload

    type follower {
        isFollower: Boolean
        isConnection: Boolean
        connection: Boolean
    }
    type isConnection {
        isFollower: String
    }

    type isRequestedUser {
        isRequested: Boolean
        isAccepted: Boolean
    }
    type user {
        id: String
        email: String
        firstName: String
        lastName: String

        avatar: String
        aboutAlumni: aboutAlumni
        isConnectIonRequested: follower
        isConnection: follower

        isRequestedUser: isRequestedUser
        isFollowing: Boolean
        myProfile: Boolean
    }
    input userDetails {
        id: ID!
    }
    type Query {
        getUserDetails(input: userDetails): user
        getAllDirectory: [user]

        # getUser: user
    }

    # input kyc {
    #   affliction: [String]!
    #   referralSource: [String]!
    #   comment: String!
    #   agreement: Boolean!
    #   identificationNumber: String
    # }
    input id {
        id: ID
    }
    input accept {
        id: ID
        accept: Boolean
    }

    type Mutation {
        connectToUser(input: id): user
        acceptConnectionRequest(input: accept): user
    }
`;
exports.directoryTypes = directoryTypes;
