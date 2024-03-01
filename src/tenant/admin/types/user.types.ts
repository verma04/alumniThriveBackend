import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const userTypes = gql`
  type alumni {
    alumni: name
    alumniOrganizationProfile: alumniOrganizationProfile
    alumniProfile: profile
    aboutAlumni: about
    alumniKyc: alumniKyc
  }
  type alumniKyc {
    referralSource: [String]
    comment: String
  }
  type name {
    firstName: String
    lastName: String
    email: String
  }
  type alumniOrganizationProfile {
    isApproved: Boolean
    isRequested: Boolean
  }

  type profile {
    country: String!
    language: String!
    phone: phone

    education: [education]
    experience: [experience]

    DOB: String!
  }
  type about {
    currentPosition: String!
    linkedin: String!
    instagram: String!
    portfolio: String!
  }
  type education {
    id: String
    school: String
    degree: String
    grade: String
    activities: String
    description: String
    duration: [String]
  }

  type experience {
    id: String
    companyName: String
    duration: [String]
    employmentType: String
    location: String
    locationType: String
    title: String
  }
  type phone {
    areaCode: String
    countryCode: Int
    isoCode: String
    phoneNumber: String
  }
  input inputId {
    id: ID
  }
  type Query {
    getAllUser: [alumni]
  }

  type Mutation {
    approveUser(input: inputId): user
  }
`;

export { userTypes };
