import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const loginTypes = gql`
  type user {
    id: ID
    firstName: String
    lastName: String
    email: String
    isProfileCompleted: Boolean
  }
  type token {
    token: String
  }
  type success {
    status: Boolean
  }
  type organizationTheme {
    colorPrimary: String
    borderRadius: String
    colorBgContainer: String
  }
  type Organization {
    organizationName: String
    logo: String
    theme: organizationTheme
  }

  type Query {
    getUser: user
    checkProfile: success
    checkDomain(domain: String): Organization
  }

  input googleLogin {
    name: String!
    avatar: String!
    googleId: String!
    email: String!
    domain: String!
  }

  input profile {
    country: String!
    language: String!
    phone: phone
    timeZone: String!
    fistName: String!
    lastName: String!
    email: String!
    DOB: String!
  }
  input about {
    currentPosition: String!
    linkedin: String!
    instagram: String!
    portfolio: String!
  }
  input education {
    id: String
    school: String
    degree: String
    grade: String
    activities: String
    description: String
    duration: [String]
  }

  input experience {
    id: String
    companyName: String
    duration: [String]
    employmentType: String
    location: String
    locationType: String
    title: String
  }
  input phone {
    areaCode: String
    countryCode: Int
    isoCode: String
    phoneNumber: String
  }

  input profileCreation {
    profile: profile
    about: about
    education: [education]
    experience: [experience]
  }

  type Mutation {
    loginByGoogle(input: googleLogin): token
    createProfile(input: profileCreation): success
  }
`;

export { loginTypes };
