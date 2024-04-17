import { eq } from "drizzle-orm";
import { db } from "../../../../../@drizzle";
import {
  aboutAlumni,
  alumni,
  alumniKyc,
  alumniProfile,
  alumniToOrganization,
} from "../../../../../@drizzle/src/db/schema";
import checkAuth from "../../utils/auth/checkAuth.utils";
import getOrg from "../../utils/getOrg.utils";

const userResolvers = {
  Query: {
    async getAllUser(_: any, { input }: any, context: any) {
      try {
        const data = await checkAuth(context);

        const findUser = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.id, data.id),
          with: {
            organization: {
              with: {},
            },
          },
        });

        const result = await db.query.alumniToOrganization.findMany({
          where: (user, { eq }) =>
            eq(user.organizationId, findUser.organization.id),
          with: {
            alumni: true,
            alumniKyc: true,
          },
        });

        console.log(result);

        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    async approveUser(_: any, { input }: any, context: any) {
      try {
        const data = await checkAuth(context);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export { userResolvers };
