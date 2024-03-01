import { GraphQLError } from "graphql";
import {
  googleLogin,
  googleLoginInput,
  profileCreationInput,
} from "../../ts-types/types";
import { db } from "../../../../@drizzle";
import { and, eq } from "drizzle-orm";
import {
  aboutAlumni,
  alumni,
  alumniProfile,
  alumniToOrganization,
} from "../../../../@drizzle/src/db/schema";
import generateJwtToken from "../../utils/generateJwtToken.utils";
import checkAuth from "../../utils/auth/checkAuth.utils";
import domainCheck from "../../../commanUtils/domianCheck";
import verifyDomain from "../../../commanUtils/verifyDomain";
const loginResolvers = {
  Query: {
    async checkDomain(_: any, { input }: any, context: any) {
      try {
        const findDomain = await db.query.domain.findFirst({
          where: (user, { eq }) => eq(user.domain, input.domain),
        });

        if (findDomain) {
          return new GraphQLError(
            "Sorry, that domain already exists. Please try a different one.",
            {
              extensions: {
                code: "NOT FOUND",
                http: { status: 400 },
              },
            }
          );
        }
        return {
          success: true,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getUser(_: any, {}: any, context: any) {
      try {
        const data = await checkAuth(context);

        const check = await db.query.alumni.findFirst({
          where: (user, { eq }) => eq(user.id, data.id),
        });

        console.log(check);

        const profileInfo = await db.query.alumniProfile.findFirst({
          where: (info, { eq }) => eq(info.alumniId, data.id),
        });

        if (profileInfo) {
          return {
            firstName: check.firstName,
            lastName: check.lastName,
            email: check.email,
            id: check?.id,
            isProfileCompleted: true,
          };
        } else {
          return {
            firstName: check.firstName,
            lastName: check.lastName,
            email: check.email,
            id: check?.id,
            isProfileCompleted: false,
          };
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    async loginByGoogle(_: any, { input }: googleLoginInput, context: any) {
      try {
        const { name, avatar, googleId, email } = input;

        const domain = await verifyDomain(input.domain);

        const user = await db.query.alumni.findFirst({
          where: (user, { eq }) => eq(user.email, email),
        });

        const loginType = "google";

        if (user) {
          const data = await generateOrganizationAlumniProfile(user.id, domain);

          const generate = await generateJwtToken(user);

          return {
            token: generate,
          };
        }
        if (!user) {
          const data = await db
            .insert(alumni)
            .values({
              avatar,
              googleId,
              email,
              firstName: name,
              lastName: "",
              loginType,
            })
            .returning();
          console.log(data);

          const generate = await generateOrganizationAlumniProfile(
            data[0].id,
            domain
          );

          const generateToken = await generateJwtToken(data[0]);

          return {
            token: generateToken,
          };
        }
      } catch (error) {
        console.log(error);
      }
    },

    async createProfile(_: any, { input }: profileCreationInput, context: any) {
      try {
        const data = await checkAuth(context);
        const { profile, about, education, experience } = input;

        const set = await db
          .update(alumni)
          .set({ firstName: profile.fistName, lastName: profile.lastName })
          .where(eq(alumni.id, data.id))
          .returning();

        const id = set[0].id;

        const set2 = await db
          .insert(alumniProfile)
          .values({
            country: profile.country,
            language: profile.language,
            DOB: profile.DOB,
            alumniId: id,
            phone: profile.phone,
            experience,
            education,
          })
          .returning();
        console.log(set2);

        await db.insert(aboutAlumni).values({
          currentPosition: about.currentPosition,
          linkedin: about.linkedin,
          instagram: about.instagram,
          portfolio: about.portfolio,
          alumniId: id,
        });
        return {
          status: true,
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export { loginResolvers };

async function generateOrganizationAlumniProfile(alumniId, organizationId) {
  const check = await db.query.alumniToOrganization.findFirst({
    where: (alumni, { eq }) =>
      and(
        eq(alumni.alumniId, alumniId),
        eq(alumni.organizationId, organizationId)
      ),
  });

  if (check) {
    return check;
  } else {
    const data = await db
      .insert(alumniToOrganization)
      .values({
        alumniId,
        organizationId,
      })
      .returning();

    return data;
  }
}
