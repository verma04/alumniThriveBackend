import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const mediaTypes = gql`
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

export { mediaTypes };
