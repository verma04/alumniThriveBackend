import { and, eq } from "drizzle-orm";
import { db } from "../../../../@drizzle";
import domainCheck from "../../../commanUtils/domianCheck";
import generateSlug from "../../../tenant/admin/utils/slug/generateSlug.utils";
import checkAuth from "../../utils/auth/checkAuth.utils";
import { feedBack, feedBackQuestion } from "../../../../@drizzle/src/db/schema";

const feedbackResolvers = {
  Query: {
    async getFeedbackQuestion(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const form = await db.query.feedBack.findFirst({
          where: and(eq(feedBack.id, input.id)),
          with: {
            feedBackQuestion: true,
          },
        });

        return form;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getFeedbackFormByType(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const form = await db.query.feedBack.findMany({
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          where: and(eq(feedBack.feedBackType, input.type)),
        });
        return form;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    async addFeedBackForm(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const slug = await generateSlug();
        console.log(input, slug);

        const createFeedBack = await db
          .insert(feedBack)
          .values({
            feedBackType: input.type,
            title: input.title,
            alumni: id,
            organization: org_id,
            slug,
          })
          .returning();

        await db.insert(feedBackQuestion).values({
          feedBack: createFeedBack[0].id,
          questionType: "multipleChoice",
        });

        return createFeedBack;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async editFeedBackForm(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        console.log(input);

        const update = await db
          .update(feedBack)
          .set({ title: input.title })
          .where(eq(feedBack.id, input.id))
          .returning();

        console.log(update[0]);

        return update[0];
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async duplicateFeedBackForm(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);
        const slug = await generateSlug();
        const form = await db.query.feedBack.findFirst({
          where: and(eq(feedBack.id, input.id)),
        });

        const feedBackQuestions = await db.query.feedBackQuestion.findMany({
          where: and(eq(feedBackQuestion.feedBack, form.id)),
        });

        const createFeedBack = await db
          .insert(feedBack)
          .values({
            feedBackType: form.feedBackType,
            title: `${form.title}-copy-1`,
            alumni: id,
            organization: org_id,
            slug,
          })
          .returning();

        const questions = feedBackQuestions.map((set) => ({
          isRequired: set.isRequired,
          questionType: set.questionType,
          feedBack: createFeedBack[0].id,
        }));

        if (questions.length > 0) {
          await db.insert(feedBackQuestion).values(questions);
        }

        return createFeedBack;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async addFeedBackQuestion(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const questions = await db
          .insert(feedBackQuestion)
          .values({
            feedBack: input.id,
            questionType: input.type,
          })
          .returning();
        console.log(questions);
        return questions;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export { feedbackResolvers };
