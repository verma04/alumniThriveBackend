import { eventsResolvers } from "./alumni/events.resolvers";
import { groupResolvers } from "./alumni/group.resolvers";
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
  },
  Mutation: {
    ...organizationResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...eventsResolvers.Mutation,
    ...mediaResolvers.Mutation,
  },
};

export default resolvers;
