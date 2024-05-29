import { GraphQLError } from "graphql";
import { db } from "../../../../@drizzle";
import {
  alumniStory,
  alumniStoryCategory,
  domain,
} from "../../../../@drizzle/src/db/schema";
import domainCheck from "../../../commanUtils/domianCheck";
import checkAuth from "../../utils/auth/checkAuth.utils";
import { and, desc, eq } from "drizzle-orm";
import generateSlug from "../../utils/slug/generateSlug";
import upload from "../../utils/upload/upload.utils";

const alumniStoriesResolvers = {
  Query: {
    async getAlumniStoriesByID(_: any, { domain, id }: any, context: any) {
      try {
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

        const story = await db.query.alumniStory.findFirst({
          where: (d, { eq }) =>
            and(
              eq(d.organization, findDomain.organizationId),
              eq(d.isApproved, true),
              eq(d.slug, id)
            ),
          with: {
            category: true,
            user: {
              with: {
                alumni: {
                  with: {
                    aboutAlumni: true,
                  },
                },
              },
            },
          },
        });
        console.log(story);

        return story;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getApprovedAlumniStories(_: any, { domain }: any, context: any) {
      try {
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

        const story = await db.query.alumniStory.findMany({
          where: (d, { eq }) =>
            and(
              eq(d.organization, findDomain.organizationId),
              eq(d.isApproved, true)
            ),
          with: {
            category: true,
          },
          orderBy: [desc(alumniStory.createdAt)],
        });
        console.log(story);
        return story;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getAlumniStoriesCategory(_: any, { domain }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const find = await db.query.alumniStoryCategory.findMany({
          where: and(eq(alumniStoryCategory.organization, org_id)),
          with: {
            alumniStory: true,
          },
          orderBy: [desc(alumniStory.createdAt)],
        });

        console.log(find);
        return find;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getMyAlumniStories(_: any, { domain }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const find = await db.query.alumniStory.findMany({
          where: and(
            eq(alumniStory.user, id),
            eq(alumniStory.organization, org_id)
          ),
          with: {
            category: true,
          },
          orderBy: [desc(alumniStory.createdAt)],
        });

        return find;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    async alumniStoryPostedByUser(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const slug = generateSlug(input.title);

        let cover;
        if (input.cover) {
          cover = await upload(input.cover);
        }

        await db.insert(alumniStory).values({
          category: input.category,
          title: input.title,
          organization: org_id,
          slug: slug,
          isApproved: false,
          shortDescription: input.shortDescription,
          description: input.description,
          cover: cover ? cover : "defaultEventCover.png",
          user: id,
        });
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

export { alumniStoriesResolvers };
