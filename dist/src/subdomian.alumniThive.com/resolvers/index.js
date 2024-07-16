"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alumni_resolvers_1 = require("./alumni/alumni.resolvers");
const alumniStories_resolvers_1 = require("./alumni/alumniStories.resolvers");
const campaign_reslovers_1 = require("./alumni/campaign.reslovers");
const directory_resolver_1 = require("./alumni/directory.resolver");
const events_resolvers_1 = require("./alumni/events.resolvers");
const feed_reslovers_1 = require("./alumni/feed.reslovers");
const feedback_resolvers_1 = require("./alumni/feedback.resolvers");
const group_resolvers_1 = require("./alumni/group.resolvers");
const jobs_resolvers_1 = require("./alumni/jobs.resolvers");
const marketPlace_resolvers_1 = require("./alumni/marketPlace.resolvers");
const media_resolvers_1 = require("./alumni/media.resolvers");
const mentorship_1 = require("./alumni/mentorship");
const organization_resolvers_1 = require("./alumni/organization.resolvers");
const graphql_upload_1 = require("graphql-upload");
const profile_1 = require("./alumni/profile");
const feedback_1 = require("./alumni/feedback");
const chat_resolvers_1 = require("./alumni/chat.resolvers");
const resolvers = {
    Upload: graphql_upload_1.GraphQLUpload,
    Query: {
        ...organization_resolvers_1.organizationResolvers.Query,
        ...group_resolvers_1.groupResolvers.Query,
        ...events_resolvers_1.eventsResolvers.Query,
        ...media_resolvers_1.mediaResolvers.Query,
        ...directory_resolver_1.directoryResolvers.Query,
        ...feed_reslovers_1.feedResolvers.Query,
        ...alumni_resolvers_1.alumniResolvers.Query,
        ...feedback_resolvers_1.feedbackResolvers.Query,
        ...jobs_resolvers_1.jobsResolvers.Query,
        ...marketPlace_resolvers_1.marketPlaceResolvers.Query,
        ...mentorship_1.mentorShipResolvers.Query,
        ...alumniStories_resolvers_1.alumniStoriesResolvers.Query,
        ...campaign_reslovers_1.campaignResolvers.Query,
        ...profile_1.profileResolvers.Query,
        ...feedback_1.helpResolvers.Query,
        ...chat_resolvers_1.chatResolvers.Query,
    },
    Mutation: {
        ...organization_resolvers_1.organizationResolvers.Mutation,
        ...group_resolvers_1.groupResolvers.Mutation,
        ...events_resolvers_1.eventsResolvers.Mutation,
        ...media_resolvers_1.mediaResolvers.Mutation,
        ...directory_resolver_1.directoryResolvers.Mutation,
        ...feed_reslovers_1.feedResolvers.Mutation,
        ...alumni_resolvers_1.alumniResolvers.Mutation,
        ...feedback_resolvers_1.feedbackResolvers.Mutation,
        ...jobs_resolvers_1.jobsResolvers.Mutation,
        ...marketPlace_resolvers_1.marketPlaceResolvers.Mutation,
        ...mentorship_1.mentorShipResolvers.Mutation,
        ...alumni_resolvers_1.alumniResolvers.Mutation,
        ...alumniStories_resolvers_1.alumniStoriesResolvers.Mutation,
        ...campaign_reslovers_1.campaignResolvers.Mutation,
        ...profile_1.profileResolvers.Mutation,
        ...feedback_1.helpResolvers.Mutation,
        ...chat_resolvers_1.chatResolvers.Mutation,
    },
    Subscription: {
        ...chat_resolvers_1.chatResolvers.Subscription,
    },
};
exports.default = resolvers;
