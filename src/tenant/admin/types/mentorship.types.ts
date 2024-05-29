import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const mentorShipTypes = gql`
  scalar Upload
  scalar Date
  type category {
    id: ID
    title: String
    createdAt: Date
    updatedAt: Date
  }
  type skills {
    id: ID
    title: String
    createdAt: Date
    updatedAt: Date
  }
  type aboutAlumniDetails {
    currentPosition: String
  }
  type alumniDetails {
    avatar: String
    lastName: String
    firstName: String
    aboutAlumni: aboutAlumniDetails
  }
  type userDetails {
    alumni: alumniDetails
  }
  type mentor {
    id: ID
    isApproved: Boolean
    isRequested: Boolean
    displayName: String
    slug: String
    about: String

    featuredArticle: String
    greatestAchievement: String
    intro: String
    introVideo: String
    whyDoWantBecomeMentor: String
    agreement: Boolean
    user: userDetails
    category: category
  }
  type Query {
    getAllMentor: [mentor]
    getAllMentorCategory: [category]
    getAllMentorSkills: [skills]
  }
  input inputMentorShipCategory {
    title: String!
  }
  input inputMentorShipSkills {
    title: String!
  }

  input inputMentorShipSkillsId {
    id: ID!
  }
  input inputMentorShipCategoryId {
    id: ID!
  }
  enum LocationType {
    APPROVE
    REJECT
    BLOCK
  }
  input mentorShipActionsInput {
    action: LocationType!
    mentorshipID: ID!
  }
  type Mutation {
    addMentorShipCategory(input: inputMentorShipCategory): [category]
    deleteMentorShipCategory(input: inputMentorShipCategoryId): category
    duplicateMentorShipCategory(input: inputMentorShipCategoryId): [category]
    mentorShipActions(input: mentorShipActionsInput): [mentor]

    addMentorShipSkills(input: inputMentorShipSkills): [skills]
    deleteMentorShipSkills(input: inputMentorShipSkillsId): skills
    duplicateMentorShipSkills(input: inputMentorShipSkillsId): [skills]
  }
`;

export { mentorShipTypes };
