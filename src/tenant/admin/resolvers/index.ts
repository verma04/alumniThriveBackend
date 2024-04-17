import { adminResolvers } from "./admin/admin.resolvers";
import { organizationResolvers } from "./admin/organization.resolvers";
import { GraphQLUpload } from "graphql-upload";
import { userResolvers } from "./admin/user.resolvers";
import { paymentResolvers } from "./payments/payments.resolvers";
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...adminResolvers.Query,
    ...organizationResolvers.Query,
    ...userResolvers.Query,
    ...paymentResolvers.Query,
  },
  Mutation: {
    ...adminResolvers.Mutation,
    ...organizationResolvers.Mutation,
    ...userResolvers.Mutation,
    ...paymentResolvers.Mutation,
  },
};

export default resolvers;
