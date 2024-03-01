import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const groupTypes = gql`
  scalar Upload
  scalar Date

  type success {
    success: Boolean
  }
  type media {
    url: String
    id: ID
  }
  type group {
    name: String
    cover: String
    id: ID
    slug: String
    total: Int
    about: String
    admin: user
    privacy: String
    groupMember: [groupMember]
    isGroupMember: Boolean
    isJoinRequest: Boolean
    isGroupAdmin: Boolean
  }
  type aboutAlumni {
    currentPosition: String
  }
  type alumni {
    id: ID
    firstName: String
    lastName: String
    memberSince: Date
    aboutAlumni: aboutAlumni
    role: String
    avatar: String
  }
  input slug {
    slug: String!
  }
  input typeid {
    id: ID!
    offset: Int
  }
  type groupMember {
    id: ID
    role: String
    createdAt: Date
    user: alumni
  }
  input request {
    alumniId: String
    groupID: String
    accept: Boolean
  }

  type Query {
    getYourGroup: [group]
    getGroupBySlug(input: slug!): group
    getGroupBySlugPeople(input: slug!): [alumni]
    getGroupFeed(input: typeid!): [feed]
    getAllAlumniFeed(input: typeid!): [feed]
    getAllGroupPeople(input: typeid!): [groupMember]
    getAllGroupRequest(input: typeid!): [groupMember]
    getAllGroupEvents(input: typeid!): [event]
  }
  type reactions {
    type: String
    user: alumni
    feedId: ID
  }

  enum privacy {
    private
    public
  }
  enum joiningConditions {
    anyoneCanJoin
    adminOnlyAdd
  }

  input addGroup {
    name: String!
    privacy: privacy!
    about: String!
    groupType: String!
  }
  input invitation {
    id: [String]!
    group: String!
  }
  input likeFeed {
    id: ID!
    type: String!
  }
  input acceptInvitation {
    group: String!
  }
  input groupFeed {
    description: String!
    groupId: String!
    image: [Upload]
  }
  type feed {
    id: ID
    description: String
    user: alumni
    createdAt: Date
    group: group
    reactions: [reactions]
    media: [media]
  }
  type Mutation {
    createGroup(input: addGroup): success
    inviteMember(input: invitation): success
    acceptInvitation(input: acceptInvitation): success
    leaveGroup(input: acceptInvitation): success
    joinGroup(input: acceptInvitation): success
    addFeedGroup(input: groupFeed): feed
    likeFeed(input: likeFeed): reactions
    acceptRequestGroup(input: request): groupMember
  }
`;

export { groupTypes };
