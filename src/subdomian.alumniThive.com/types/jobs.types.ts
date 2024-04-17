import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const jobsTypes = gql`
  scalar Upload

  type Jobs {
    id: ID
    jobTitle: String
    slug: String
    location: String
    company: String

    jobType: String
    workplaceType: String
    salary: String
    tag: [jobTag]
    description: String
    experience: String
  }
  type jobTag {
    tag: String
  }

  # input kyc {
  #   affliction: [String]!
  #   referralSource: [String]!
  #   comment: String!
  #   agreement: Boolean!
  #   identificationNumber: String
  # }
  input tag {
    jobTitle: String!
    location: String!
    jobType: String!
    workplaceType: String
    salary: String!
    tag: [jobTagInput]
    description: String!
    company: String!
    experience: String!
  }
  input jobTagInput {
    tag: String
  }
  input inputID {
    id: ID!
  }
  input inputSlug {
    slug: String!
  }
  input applyJobInput {
    id: ID!
    fullName: String!
    email: String!
    phone: String!
    resume: String!
  }

  type Mutation {
    postJob(input: tag): [Jobs]
    duplicateJob(input: inputID): [Jobs]
    applyJob(input: applyJobInput): success
  }
  type Query {
    getAllJobs: [Jobs]
    getJobPostedByMe: [Jobs]
    getJobBySlug(input: inputSlug): Jobs
  }
`;

export { jobsTypes };
