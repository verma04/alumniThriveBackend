import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking');
const eventsTypes = gql`
  scalar Upload
  scalar Date
  type payments {
    paymentMode: String
    paypalDetails: String
    ifscCode: String
    eventCost: String
    costPerAdults: Int
    costPerChildren: Int
    accountNumber: String
    bankName: String
    currency: String
  }

  type event {
    id: String
    details: String
    eventEndTime: Date
    eventStartTime: Date
    eventType: String
    eventVisibility: String
    group: group
    name: String
    registrationEndDate: Date
    venue: String
    cover: String
    slug: String
    eventHost: user
    eventsPayments: payments
  }

  input addEvent {
    cover: Upload
    accountNumber: String
    bankName: String
    costPerAdults: Int
    costPerChildren: Int
    currency: String
    details: String
    eventCost: String
    eventEndTime: Date
    eventStartTime: Date
    eventType: String
    eventVisibility: String
    group: String
    ifscCode: String
    name: String
    paymentMode: String
    paypalDetails: String
    registrationEndDate: Date
    venue: String
  }
  type Mutation {
    createEventForGroup(input: addEvent): event
  }
`;

export { eventsTypes };
