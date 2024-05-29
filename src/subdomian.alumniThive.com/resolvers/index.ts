import { mentorShip } from "../../../@drizzle/src/db/schema";

import { alumniResolvers } from "./alumni/alumni.resolvers";
import { alumniStoriesResolvers } from "./alumni/alumniStories.resolvers";
import { campaignResolvers } from "./alumni/campaign.reslovers";
import { directoryResolvers } from "./alumni/directory.resolver";
import { eventsResolvers } from "./alumni/events.resolvers";
import { feedResolvers } from "./alumni/feed.reslovers";
import { feedbackResolvers } from "./alumni/feedback.resolvers";

import { groupResolvers } from "./alumni/group.resolvers";
import { jobsResolvers } from "./alumni/jobs.resolvers";
import { marketPlaceResolvers } from "./alumni/marketPlace.resolvers";
import { mediaResolvers } from "./alumni/media.resolvers";
import { mentorShipResolvers } from "./alumni/mentorship";
import { organizationResolvers } from "./alumni/organization.resolvers";
import { GraphQLUpload } from "graphql-upload";
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...organizationResolvers.Query,
    ...groupResolvers.Query,
    ...eventsResolvers.Query,
    ...mediaResolvers.Query,
    ...directoryResolvers.Query,
    ...feedResolvers.Query,
    ...alumniResolvers.Query,
    ...feedbackResolvers.Query,
    ...jobsResolvers.Query,
    ...marketPlaceResolvers.Query,
    ...mentorShipResolvers.Query,
    ...alumniStoriesResolvers.Query,
    ...campaignResolvers.Query,
  },
  Mutation: {
    ...organizationResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...eventsResolvers.Mutation,
    ...mediaResolvers.Mutation,
    ...directoryResolvers.Mutation,
    ...feedResolvers.Mutation,
    ...alumniResolvers.Mutation,
    ...feedbackResolvers.Mutation,
    ...jobsResolvers.Mutation,
    ...marketPlaceResolvers.Mutation,
    ...mentorShipResolvers.Mutation,
    ...alumniResolvers.Mutation,
    ...alumniStoriesResolvers.Mutation,
    ...campaignResolvers.Mutation,
  },
};

export default resolvers;
