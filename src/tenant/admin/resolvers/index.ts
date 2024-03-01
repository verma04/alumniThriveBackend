import { adminResolvers } from "./admin/admin.resolvers";
import { organizationResolvers } from "./admin/organization.resolvers";
import { GraphQLUpload } from "graphql-upload";
import { userResolvers } from "./admin/user.resolvers";
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...adminResolvers.Query,
    ...organizationResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...adminResolvers.Mutation,
    ...organizationResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};

export default resolvers;
