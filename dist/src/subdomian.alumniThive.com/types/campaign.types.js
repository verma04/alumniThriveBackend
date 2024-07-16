"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const campaignTypes = (0, apollo_server_core_1.gql) `
    scalar Upload
    scalar Date
    type campaignCategory {
        id: ID
        title: String
        count: Int
    }
    type campaign {
        id: ID
        title: String
        cover: String
        slug: String
        category: campaignCategory
        isApproved: Boolean
        createdAt: Date
        shortDescription: String
        description: String
        updatedAt: Date
        user: mentorUser
        campaignType: String
        amount: Int
    }
    type Query {
        getApprovedCampaign(domain: String): [campaign]
        getCampaignCategory: [campaignCategory]
        getMyCampaign: [campaign]
        getCampaignByID(domain: String, id: ID): campaign
    }

    input inputUserCampaign {
        category: ID!
        description: String!
        shortDescription: String!
        title: String!
        cover: Upload
        gallery: [Upload]
        endDate: Date!
        amount: Int
        campaignType: String!
    }
    input paymentInput {
        id: ID!
        amount: Int
    }

    type Mutation {
        addFundCampaign(input: inputUserCampaign): success
        campaignFundPayment(input: paymentInput): paymentResponse
    }
`;
exports.campaignTypes = campaignTypes;
