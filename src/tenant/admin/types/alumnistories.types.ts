import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const alumniStoriesTypes = gql`
  scalar Upload
  scalar Date
  type category {
    id: ID
    title: String
    createdAt: Date
    updatedAt: Date
  }
  type alumniStories {
    id: ID
    title: String
    cover: String
    slug: String
    category: category
    isApproved: Boolean
    createdAt: Date
    shortDescription: String
    description: String
    updatedAt: Date
    user: userDetails
  }
  type Query {
    getAllAlumniStoriesCategory: [category]
    getAllAlumniStories: [alumniStories]
    getAllApprovedAlumniStories: [alumniStories]
    getAllApprovedRequestedStories: [alumniStories]
  }

  input inputAlumniStoryCategory {
    title: String!
  }
  input inputAlumniStoryCategoryId {
    id: ID!
  }

  input alumniStoriesInput {
    action: LocationType!
    ID: ID!
  }
  type Mutation {
    alumniStoriesActions(input: alumniStoriesInput): alumniStories

    addAlumniStoryCategory(input: inputAlumniStoryCategory): [category]
    deleteAlumniStoryCategory(input: inputAlumniStoryCategoryId): category
    duplicateAlumniStoryCategory(input: inputAlumniStoryCategoryId): [category]
  }
`;

export { alumniStoriesTypes };
