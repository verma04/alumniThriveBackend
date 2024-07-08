import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const givingTypes = gql`
    scalar Upload
    scalar Date
    type category {
        id: ID
        title: String
        createdAt: Date
        updatedAt: Date
    }
    type recommendation {
        id: ID
        price: String
        createdAt: Date
        updatedAt: Date
    }
    type campaign {
        id: ID
        title: String
        cover: String
        slug: String
        category: category
        isApproved: Boolean
        createdAt: Date
        shortDescription: String
        description: String
        updatedAt: Date
        user: userDetails
    }
    type Query {
        getAllFundCampaignCategory: [category]
        getAllFundCampaign: [campaign]
        getAllApprovedFundCampaign: [campaign]
        getAllRequestedFundCampaign: [campaign]
    }

    input inputFundCampaignCategory {
        title: String!
    }
    input inputFundCampaignCategoryId {
        id: ID!
    }

    input inputAmountRecommendation {
        price: String!
    }
    input inputAmountRecommendationId {
        id: ID!
    }
    input fundCampaignInput {
        action: LocationType!
        ID: ID!
    }

    input input {
        title: String!
    }
    input inputId {
        id: ID!
    }

    input fundCampaignInput {
        action: LocationType!
        ID: ID!
    }
    type Mutation {
        fundCampaignActions(input: fundCampaignInput): campaign
        addFundCampaignCategory(input: inputFundCampaignCategory): [category]
        deleteCampaignCategory(input: inputFundCampaignCategoryId): category
        duplicateCampaignCategory(
            input: inputFundCampaignCategoryId
        ): [category]
        addAmountRecommendation(
            input: inputAmountRecommendation
        ): [recommendation]
        deleteAmountRecommendation(input: inputId): recommendation
        duplicateAmountRecommendation(
            input: inputAmountRecommendationId
        ): [recommendation]
    }
`

export { givingTypes }
