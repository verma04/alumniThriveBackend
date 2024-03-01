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
        console.log(data);

        const orgId = await getOrg(data.id);

        const result2 = await db.query.alumniToOrganization.findMany({});
        const result = await db.query.alumniToOrganization.findMany({
          where: (user, { eq }) => eq(user.organizationId, data.id),
          with: {
            alumni: true,
          },
        });

        console.log(result, result2);
        // return result;
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
