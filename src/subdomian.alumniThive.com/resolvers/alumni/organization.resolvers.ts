import { db } from "../../../../@drizzle";

import { GraphQLError } from "graphql";

import { checkEmail } from "../../utils/mail/checkmail.utils";
import checkAuth from "../../utils/auth/checkAuth.utils";
import {
  alumniKyc,
  alumniToOrganization,
  alumniToOrganizationRelations,
  domain,
  organization,
  profileInfo,
  users,
} from "../../../../@drizzle/src/db/schema";
import { and, eq } from "drizzle-orm";
import upload from "../../utils/upload/upload.utils";
import { inputKyc, kyc } from "../../ts-types/types";

import domainCheck from "../../../commanUtils/domianCheck";

const organizationResolvers = {
  Query: {
    async checkDomain(_: any, { domain }: any, context: any) {
      console.log(domain);

      const findDomain = await db.query.domain.findFirst({
        where: (d, { eq }) =>
          eq(d.domain, domain?.split(".")[0]?.replace("http://", "")),
      });
      if (!findDomain) {
        return new GraphQLError("No Domain Found", {
          extensions: {
            code: "NOT FOUND",
            http: { status: 404 },
          },
        });
      }

      const findOrg = await db.query.organization.findFirst({
        where: (d, { eq }) => eq(d.id, findDomain.organizationId),
        with: {
          theme: true,
        },
      });

      return findOrg;
    },
    async getUser(_: any, {}: any, context: any) {
      try {
        const data = await checkAuth(context);

        const org_id = await domainCheck(context);

        console.log(data.id, "sd");

        const findOrg = await db.query.alumniToOrganization.findFirst({
          where: and(
            eq(alumniToOrganization.alumniId, data.id),
            eq(alumniToOrganization.organizationId, org_id)
          ),
          with: {
            followers: true,
            following: true,
          },
        });

        console.log(findOrg);
        const findUser = await db.query.alumni.findFirst({
          where: (d, { eq }) => eq(d.id, findOrg.alumniId),
        });

        return {
          id: findUser.id,
          firstName: findUser.firstName,
          lastName: findUser.lastName,
          email: findUser.email,
          isApproved: findOrg.isApproved,
          isRequested: findOrg.isRequested,
          avatar: findUser.avatar,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    async completeKyc(_: any, { input }: inputKyc, context: any) {
      try {
        const {
          affliction,
          referralSource,
          comment,
          agreement,
          identificationNumber,
        } = input;
        const data = await checkAuth(context);

        const findOrg = await db.query.alumniToOrganization.findFirst({
          where: (d, { eq }) => eq(d.alumniId, data.id),
        });

        await db.insert(alumniKyc).values({
          affliction: affliction,
          referralSource: referralSource,
          comment: comment,
          agreement: agreement,
          orgId: findOrg.organizationId,
        });

        const datas = await db
          .update(alumniToOrganization)
          .set({ isRequested: true })
          .where(eq(alumniToOrganization.alumniId, data.id))
          .returning();

        return {
          success: true,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export { organizationResolvers };
