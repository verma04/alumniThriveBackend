import { adminResolvers } from "./admin/admin.resolvers";
import { organizationResolvers } from "./admin/organization.resolvers";
import { GraphQLUpload } from "graphql-upload";
import { userResolvers } from "./admin/user.resolvers";
import { paymentResolvers } from "./payments/payments.resolvers";
import { mentorShipResolvers } from "./admin/mentorship.resolvers";
import { alumniStoriesResolvers } from "./admin/alumnistories.resolvers";
import { givingResolvers } from "./admin/giving.reslovers";
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...adminResolvers.Query,
    ...organizationResolvers.Query,
    ...userResolvers.Query,
    ...paymentResolvers.Query,
    ...mentorShipResolvers.Query,
    ...alumniStoriesResolvers.Query,
    ...givingResolvers.Query,
  },
  Mutation: {
    ...adminResolvers.Mutation,
    ...organizationResolvers.Mutation,
    ...userResolvers.Mutation,
    ...paymentResolvers.Mutation,
    ...mentorShipResolvers.Mutation,
    ...alumniStoriesResolvers.Mutation,
    ...givingResolvers.Mutation,
  },
};

export default resolvers;
