"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorShipTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const mentorShipTypes = (0, apollo_server_core_1.gql) `
    scalar Upload
    type mentorShip {
        id: ID
        isApproved: Boolean
        isRequested: Boolean
        displayName: String
        slug: String
    }

    type paymentResponse {
        id: String
        entity: String
        amount: String
        amount_paid: String
        amount_due: Int
        currency: String
        receipt: String
        status: String
        attempts: String
        created_at: Date
        payment: Boolean
        key_id: String
    }
    type testimonial {
        id: ID
        testimonial: String
        from: String
    }
    type mentor {
        displayName: String
        about: String
        id: String
        slug: String
        user: mentorUser
    }
    type alumni {
        firstName: String
        lastName: String
    }
    type mentorUser {
        alumni: alumni
    }

    type services {
        id: ID
        serviceType: String
        priceType: String
        title: String
        duration: Int
        price: Int
        shortDescription: String
        description: String
        webinarUrl: String
        mentorship: mentor
        webinarDate: Date
        booking: isBooking
    }
    type isBooking {
        isBooking: Boolean
        createdAt: Date
    }
    input inputAddServices {
        serviceType: String!
        priceType: String!
        title: String!
        duration: Int!
        price: Int
        shortDescription: String!
        description: String
        webinarUrl: String
        webinarDate: Date
    }
    input inputPaymentDetails {
        razorpay_order_id: String!
        razorpay_payment_id: String!
        razorpay_signature: String!
        serviceID: ID!
    }

    input inputFreeBookingDetails {
        serviceID: ID!
    }

    type mentorCategory {
        id: ID
        title: String
        count: Int
    }

    type mentorSkills {
        id: ID
        title: String
        count: Int
    }
    type currency {
        symbol: String
        cc: String
    }
    type booking {
        id: ID
        user: mentorUser
        service: services
        createdAt: Date
    }
    type Query {
        getMentorProfileBySlug(input: inputID): mentor
        getAllMentorServicesByID(input: inputID): [services]
        getAllApprovedMentor: [mentor]
        getAllMentorServices: [services]
        getAllMentorTestimonial: [testimonial]
        getCurrency: currency
        getAllMentorCategory: [mentorCategory]
        getAllMentorSkills: [mentorSkills]
        checkMentorShip: mentorShip
        checkMentorShipUrl(input: checkUrl): success
        checkWebinarPaymentResponse(input: inputID): paymentResponse
        getServicesDetails(input: inputID!): services
        getBookingRequest: [booking]
        getUpcomingBooking: [booking]
        getCancelledBooking: [booking]
        getCompletedBooking: [booking]
    }

    input checkUrl {
        url: String
    }
    input registerMentorShipInput {
        about: String!
        category: String!
        displayName: String!
        featuredArticle: String
        greatestAchievement: String
        intro: String
        introVideo: String!
        whyDoWantBecomeMentor: String
        agreement: Boolean!
    }
    input registerTestimonialInput {
        testimonial: String!
        from: String!
    }
    input inputAcceptBookingRequest {
        bookingID: ID!
        url: String!
    }

    input inputCancelBooking {
        bookingID: ID!
    }
    input inputCompletedBooking {
        bookingID: ID!
    }
    type Mutation {
        addMentorShipTestimonials(
            input: registerTestimonialInput
        ): [testimonial]
        registerMentorShip(input: registerMentorShipInput): success
        addMentorShipServices(input: inputAddServices): [services]
        duplicateMentorShipServices(input: inputID): [services]
        duplicateMentorShipTestimonials(input: inputID): [testimonial]
        bookPaidWebinar(input: inputPaymentDetails): success
        bookFreeWebinar(input: inputFreeBookingDetails): success
        acceptBookingRequest(input: inputAcceptBookingRequest): booking
        cancelBooking(input: inputCancelBooking): booking
        markBookingAsCompleted(input: inputCompletedBooking): booking
    }
`;
exports.mentorShipTypes = mentorShipTypes;
