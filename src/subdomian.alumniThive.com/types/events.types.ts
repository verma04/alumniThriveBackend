import { gql } from 'apollo-server-core'

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
        showPrice: Boolean
    }
    type sponsor {
        eventSponsorship: [eventSponsorship]
        eventSponsors: [eventSponsors]
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
        isRegistered: Boolean
        tag: [String]
    }

    type events {
        totalRecords: Int
        data: [event]
    }

    type host {
        id: String
        hostType: String
        createdAt: Date
        updatedAt: Date
        alumni: connection
    }

    input addEvent {
        cover: Upload
        costPerAdults: Int
        costPerChildren: Int
        details: String
        eventCost: String
        eventEndTime: Date
        eventStartTime: Date
        eventType: String
        eventVisibility: String
        group: String
        name: String
        registrationEndDate: Date
        venue: String
        contactNumber: String
        contactEmail: String
        tag: [String]
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
        showPrice: Boolean
    }

    input slug {
        slug: String
    }
    input typeHostId {
        id: ID
        event: String
    }
    input deleteSponsorShip {
        id: String
    }
    type venue {
        venue: String
        id: String
        address: String
    }
    input addVenue {
        venue: String
        id: String
        address: String
        event: String
    }
    input addSpeaker {
        id: String
        name: String
        linkedin: String
        cover: Upload
        about: String
        event: String!
        type: String!
        speaker: ID
    }
    input addAgenda {
        id: String
        title: String
        videoSteam: String
        date: String
        startTime: String
        endTime: String
        venue: String
        speakers: [String]
        isPinned: Boolean
        isDraft: Boolean
        isPublished: Boolean
        description: String
        event: ID
    }
    type agenda {
        id: String
        title: String
        videoSteam: String
        date: String
        startTime: String
        endTime: String
        venue: String
        isPinned: Boolean
        isDraft: Boolean
        isPublished: Boolean
        description: String
    }
    type speaker {
        avatar: String
        id: String
        fullName: String
        linkedin: String
        cover: Upload
        about: String
    }
    type eventSponsors {
        id: ID
        sponsorUserName: String
        sponsorUserDesignation: String
        sponsorLogo: String
        sponsorShip: eventSponsorship
        createdAt: Date
        sponsorName: String
    }
    input inputEventSponsors {
        sponsorUserName: String
        sponsorUserDesignation: String
        sponsorLogo: Upload
        sponsorShipId: String
        sponsorName: String
        event: String!
    }
    type eventGallery {
        id: ID
        mediaType: String
        url: String
    }
    input inputEventGallery {
        mediaType: String
        file: [Upload]
        event: String
    }
    type success {
        success: Boolean
    }
    type payment {
        orderId: String
        currency: String
        amount: String
    }
    input filterProps {
        sort: String
        cost: String
        search: String
        mode: String
        privacy: String
        offset: Int
        limit: Int
    }
    type Query {
        getEventBySlug(input: slug): event
        getAllEvents(input: filterProps): events
        getEventAsHost: [event]
        getEventSponsorship(input: slug): [eventSponsorship]
        getAllHost(input: slug): [host]
        getAllVenue(input: slug): [venue]
        getAllSpeakers(input: slug): [speaker]
        getAllAgenda(input: slug): [agenda]
        getEventGallery(input: slug): [eventGallery]
        getEventSponsors(input: slug): [eventSponsors]
        getSponsorshipEvents(input: slug): sponsor
        getSpeakersEvents(input: slug): [speaker]
        getPaidEventsDetails(input: slug): payment
        getEventsType: [String]
        getEventCostType: [String]
    }
    type Mutation {
        createEventForGroup(input: addEvent): event
        createEvent(input: addEvent): event
        addSponsorShip(input: eventCreateSponsorShip): eventSponsorship
        deleteSponsorShip(input: deleteSponsorShip): eventSponsorship
        addHost(input: typeHostId): host
        removeHost(input: typeHostId): host
        addVenue(input: addVenue): venue
        addEventSpeaker(input: addSpeaker): speaker
        addEventAgenda(input: addAgenda): agenda
        addEventMedia(input: inputEventGallery): [eventGallery]
        addEventSponsors(input: inputEventSponsors): eventSponsors
        registerEvent(input: slug): success
        registerPaidEvent(input: slug): success
    }
`

export { eventsTypes }
