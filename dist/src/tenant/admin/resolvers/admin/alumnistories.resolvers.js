"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniStoriesResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const mentorship_resolvers_1 = require("./mentorship.resolvers");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const graphql_1 = require("graphql");
const alumniStoriesResolvers = {
    Query: {
        async getAllAlumniStoriesCategory(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const category = await _drizzle_1.db.query.alumniStoryCategory.findMany({
                    where: (alumniStoryCategory, { eq }) => eq(alumniStoryCategory.organization, userOrgId),
                    orderBy: (alumniStoryCategory, { desc }) => [
                        desc(alumniStoryCategory.createdAt),
                    ],
                });
                return category;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllAlumniStories(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const stories = await _drizzle_1.db.query.alumniStory.findMany({
                    where: (alumniStory, { eq }) => (0, drizzle_orm_1.and)(eq(alumniStory.organization, userOrgId)),
                    orderBy: (alumniStory, { desc }) => [
                        desc(alumniStory.createdAt),
                    ],
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
                console.log(stories);
                return stories;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllApprovedAlumniStories(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const stories = await _drizzle_1.db.query.alumniStory.findMany({
                    where: (alumniStory, { eq }) => (0, drizzle_orm_1.and)(eq(alumniStory.organization, userOrgId), eq(alumniStory.isApproved, true)),
                    orderBy: (alumniStory, { desc }) => [
                        desc(alumniStory.createdAt),
                    ],
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
                return stories;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllApprovedRequestedStories(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const stories = await _drizzle_1.db.query.alumniStory.findMany({
                    where: (alumniStory, { eq }) => (0, drizzle_orm_1.and)(eq(alumniStory.organization, userOrgId), eq(alumniStory.isApproved, false)),
                    orderBy: (alumniStory, { desc }) => [
                        desc(alumniStory.createdAt),
                    ],
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
                return stories;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addAlumniStoryCategory(_, { input }, context) {
            try {
                console.log(input);
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const set = await _drizzle_1.db.query.alumniStoryCategory.findFirst({
                    where: (alumniStoryCategory, { eq }) => (0, drizzle_orm_1.and)(eq(alumniStoryCategory.organization, userOrgId), eq(alumniStoryCategory.title, input.title)),
                });
                console.log(set);
                if (set) {
                    return new graphql_1.GraphQLError('Category AllReady exist', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                const createOrganization = await _drizzle_1.db
                    .insert(schema_1.alumniStoryCategory)
                    .values({
                    title: input.title,
                    organization: userOrgId,
                })
                    .returning();
                return createOrganization;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async deleteAlumniStoryCategory(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, mentorship_resolvers_1.userOrg)(data.id);
                const category = await _drizzle_1.db
                    .delete(schema_1.alumniStoryCategory)
                    .where((0, drizzle_orm_1.eq)(schema_1.alumniStoryCategory.id, input.id))
                    .returning();
                return category;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateAlumniStoryCategory(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const category = await _drizzle_1.db.query.alumniStoryCategory.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniStoryCategory.id, input.id)),
                });
                console.log(input);
                const createFeedBack = await _drizzle_1.db
                    .insert(schema_1.alumniStoryCategory)
                    .values({
                    organization: category.organization,
                    title: `${category.title}-copy-1`,
                })
                    .returning();
                return createFeedBack;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async alumniStoriesActions(_, { input }, context) {
            try {
                const check = await _drizzle_1.db.query.alumniStory.findFirst({
                    where: (alumniStory, { eq }) => (0, drizzle_orm_1.and)(eq(alumniStory.id, input.ID)),
                });
                const update = await _drizzle_1.db
                    .update(schema_1.alumniStory)
                    .set({ isApproved: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.alumniStory.id, input.ID))
                    .returning();
                return update[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.alumniStoriesResolvers = alumniStoriesResolvers;
