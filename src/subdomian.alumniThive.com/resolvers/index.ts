import { alumniResolvers } from "./alumni/alumni.resolvers";
import { directoryResolvers } from "./alumni/directory.resolver";
import { eventsResolvers } from "./alumni/events.resolvers";
import { feedResolvers } from "./alumni/feed.reslovers";
import { feedbackResolvers } from "./alumni/feedback.resolvers";
import { groupResolvers } from "./alumni/group.resolvers";
import { jobsResolvers } from "./alumni/jobs.resolvers";
import { marketPlaceResolvers } from "./alumni/marketPlace.resolvers";
import { mediaResolvers } from "./alumni/media.resolvers";
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
  },
};

export default resolvers;
