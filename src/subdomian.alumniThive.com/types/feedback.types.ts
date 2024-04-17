import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const feedbackTypes = gql`
  scalar Upload

  type feedBack {
    id: ID
  }

  input inputFeedForm {
    title: String!
    type: String!
  }
  input inputDuplicateFeedBackForm {
    id: ID!
  }
  input inputEditFeedForm {
    id: ID!
    title: String!
    type: String!
  }
  type feedBackQuestion {
    id: ID
    questionType: String
    createdAt: Date
    updatedAt: Date
    isRequired: Boolean
  }
  type feedBackForm {
    id: ID
    title: String
    type: String
    slug: String
    feedBackQuestion: [feedBackQuestion]
  }
  input feedBackType {
    type: String!
  }
  input id {
    id: ID!
  }

  input addQuestionFeedback {
    id: ID!
    type: String!
  }

  type Query {
    getFeedbackFormByType(input: feedBackType!): [feedBackForm]
    getFeedbackQuestion(input: id): feedBackForm
  }

  type Mutation {
    addFeedBackForm(input: inputFeedForm): [feedBackForm]
    editFeedBackForm(input: inputEditFeedForm): feedBackForm
    duplicateFeedBackForm(input: inputDuplicateFeedBackForm): [feedBackForm]
    addFeedBackQuestion(input: addQuestionFeedback): [feedBackQuestion]
  }
`;

export { feedbackTypes };
