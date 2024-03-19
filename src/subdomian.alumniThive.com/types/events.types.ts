import { gql } from "apollo-server-core";

// const { Parking } = require('../models/Parking')
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

  type eventHost {
    role: String
  }
  type content {
    title: String
    description: String
  }

  type eventSponsorship {
    id: ID
    role: String
    sponsorType: String
    currency: String
    price: Int
    content: [content]
    slug: String
    event: event
    createdAt: Date
    updatedAt: Date
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
    eventHost: eventHost
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
    contactNumber: String
    contactEmail: String
  }

  input item {
    title: String
    description: String
  }
  input eventCreateSponsorShip {
    type: String
    currency: String
    price: Int
    content: [item]
    slug: String!
  }

  input slug {
    slug: String
  }
  input deleteSponsorShip {
    id: String
  }
  type Query {
    getEventBySlug(input: slug): event
    getAllEvents: [event]
    getEventAsHost: [event]
    getEventSponsorship(input: slug): [eventSponsorship]
  }
  type Mutation {
    createEventForGroup(input: addEvent): event
    createEvent(input: addEvent): event
    addSponsorShip(input: eventCreateSponsorShip): eventSponsorship
    deleteSponsorShip(input: deleteSponsorShip): eventSponsorship
  }
`;

export { eventsTypes };
