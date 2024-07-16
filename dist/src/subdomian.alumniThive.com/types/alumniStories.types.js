"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniStoriesTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const alumniStoriesTypes = (0, apollo_server_core_1.gql) `
    scalar Upload
    scalar Date
    type storiesCategory {
        id: ID
        title: String
        count: Int
    }
    type alumniStories {
        id: ID
        title: String
        cover: String
        slug: String
        category: storiesCategory
        isApproved: Boolean
        createdAt: Date
        shortDescription: String
        description: String
        updatedAt: Date
        user: mentorUser
    }
    type Query {
        getApprovedAlumniStories(domain: String): [alumniStories]
        getAlumniStoriesCategory: [storiesCategory]
        getMyAlumniStories: [alumniStories]
        getAlumniStoriesByID(domain: String, id: ID): alumniStories
    }

    input inputAlumniStoryPostedByUser {
        category: ID!
        description: String!
        shortDescription: String!
        title: String!
        url: String!
        cover: Upload
    }
    input inputAlumniStoryByID {
        category: ID!
        description: String!
        shortDescription: String!
        title: String!
        url: String!
        cover: Upload
    }

    type Mutation {
        alumniStoryPostedByUser(input: inputAlumniStoryPostedByUser): success
    }
`;
exports.alumniStoriesTypes = alumniStoriesTypes;
