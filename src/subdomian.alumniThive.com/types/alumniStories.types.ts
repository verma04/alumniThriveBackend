import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const alumniStoriesTypes = gql`
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

export { alumniStoriesTypes };
