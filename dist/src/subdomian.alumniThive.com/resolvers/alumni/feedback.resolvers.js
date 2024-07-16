"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const generateSlug_utils_1 = __importDefault(require("../../../tenant/admin/utils/slug/generateSlug.utils"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const feedbackResolvers = {
    Query: {
        async getFeedbackQuestion(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const form = await _drizzle_1.db.query.feedBack.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedBack.id, input.id)),
                    with: {
                        feedBackQuestion: true,
                    },
                });
                return form;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getFeedbackFormByType(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const form = await _drizzle_1.db.query.feedBack.findMany({
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedBack.feedBackType, input.type)),
                });
                return form;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addFeedBackForm(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const slug = await (0, generateSlug_utils_1.default)();
                const createFeedBack = await _drizzle_1.db
                    .insert(schema_1.feedBack)
                    .values({
                    feedBackType: input.type,
                    title: input.title,
                    alumni: id,
                    organization: org_id,
                    slug,
                })
                    .returning();
                await _drizzle_1.db.insert(schema_1.feedBackQuestion).values({
                    feedBack: createFeedBack[0].id,
                    questionType: 'multipleChoice',
                });
                return createFeedBack;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async editFeedBackForm(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                console.log(input);
                const update = await _drizzle_1.db
                    .update(schema_1.feedBack)
                    .set({ title: input.title })
                    .where((0, drizzle_orm_1.eq)(schema_1.feedBack.id, input.id))
                    .returning();
                console.log(update[0]);
                return update[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateFeedBackForm(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const slug = await (0, generateSlug_utils_1.default)();
                const form = await _drizzle_1.db.query.feedBack.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedBack.id, input.id)),
                });
                const feedBackQuestions = await _drizzle_1.db.query.feedBackQuestion.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedBackQuestion.feedBack, form.id)),
                });
                const createFeedBack = await _drizzle_1.db
                    .insert(schema_1.feedBack)
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
                    await _drizzle_1.db.insert(schema_1.feedBackQuestion).values(questions);
                }
                return createFeedBack;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addFeedBackQuestion(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const questions = await _drizzle_1.db
                    .insert(schema_1.feedBackQuestion)
                    .values({
                    feedBack: input.id,
                    questionType: input.type,
                })
                    .returning();
                console.log(questions);
                return questions;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.feedbackResolvers = feedbackResolvers;
