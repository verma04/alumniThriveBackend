"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorShipResolvers = exports.userOrg = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const graphql_1 = require("graphql");
const userOrg = async (id) => {
    const findUser = await _drizzle_1.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, id),
        with: {
            organization: {
                with: {},
            },
        },
    });
    return findUser.organization.id;
};
exports.userOrg = userOrg;
const mentorShipResolvers = {
    Query: {
        async getAllMentorCategory(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, exports.userOrg)(data.id);
                const set = await _drizzle_1.db.query.mentorshipCategory.findMany({
                    where: (mentorshipCategory, { eq }) => eq(mentorshipCategory.organization, userOrgId),
                    orderBy: (mentorshipCategory, { desc }) => [
                        desc(mentorshipCategory.createdAt),
                    ],
                });
                return set;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllMentorSkills(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, exports.userOrg)(data.id);
                const set = await _drizzle_1.db.query.mentorshipSkills.findMany({
                    where: (mentorshipCategory, { eq }) => eq(mentorshipCategory.organization, userOrgId),
                    orderBy: (mentorshipCategory, { desc }) => [
                        desc(mentorshipCategory.createdAt),
                    ],
                });
                return set;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllMentor(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, exports.userOrg)(data.id);
                const set = await _drizzle_1.db.query.mentorShip.findMany({
                    where: (mentorShip, { eq }) => eq(mentorShip.organization, userOrgId),
                    orderBy: (mentorShip, { desc }) => [
                        desc(mentorShip.createdAt),
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
                console.log(JSON.stringify(set, null, 4));
                return set;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        // async getAllApprovedMentor(_: any, { input }: any, context: any) {
        //   try {
        //     const data = await checkAuth(context);
        //     const userOrgId = await userOrg(data.id);
        //     const set = await db.query.mentorShip.findMany({
        //       where: (mentorShip, { eq }) => eq(mentorShip.organization, userOrgId),
        //       orderBy: (mentorShip, { desc }) => [desc(mentorShip.createdAt)],
        //     });
        //     return set;
        //   } catch (error) {
        //     console.log(error);
        //     throw error;
        //   }
        // },
        // async getAllMentorRequests(_: any, { input }: any, context: any) {
        //   try {
        //     const data = await checkAuth(context);
        //     const userOrgId = await userOrg(data.id);
        //     const set = await db.query.mentorShip.findMany({
        //       where: (mentorShip, { eq }) => eq(mentorShip.organization, userOrgId),
        //       orderBy: (mentorShip, { desc }) => [desc(mentorShip.createdAt)],
        //     });
        //     return set;
        //   } catch (error) {
        //     console.log(error);
        //     throw error;
        //   }
        // },
        // async getAllBlockedMentor(_: any, { input }: any, context: any) {
        //   try {
        //     const data = await checkAuth(context);
        //     const userOrgId = await userOrg(data.id);
        //     const set = await db.query.mentorShip.findMany({
        //       where: (mentorShip, { eq }) => eq(mentorShip.organization, userOrgId),
        //       orderBy: (mentorShip, { desc }) => [desc(mentorShip.createdAt)],
        //     });
        //     return set;
        //   } catch (error) {
        //     console.log(error);
        //     throw error;
        //   }
        // },
    },
    Mutation: {
        async mentorShipActions(_, { input }, context) {
            try {
                const check = await _drizzle_1.db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShip.id, input.mentorshipID)),
                });
                console.log(check);
                const update = await _drizzle_1.db
                    .update(schema_1.mentorShip)
                    .set({ isApproved: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.mentorShip.id, input.mentorshipID))
                    .returning();
                console.log(update);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addMentorShipCategory(_, { input }, context) {
            try {
                console.log(input);
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, exports.userOrg)(data.id);
                const set = await _drizzle_1.db.query.mentorshipCategory.findFirst({
                    where: (mentorshipCategory, { eq }) => (0, drizzle_orm_1.and)(eq(mentorshipCategory.organization, userOrgId), eq(mentorshipCategory.title, input.title)),
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
                    .insert(schema_1.mentorshipCategory)
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
        async deleteMentorShipCategory(_, { input }, context) {
            try {
                console.log(input);
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, exports.userOrg)(data.id);
                const category = await _drizzle_1.db
                    .delete(schema_1.mentorshipCategory)
                    .where((0, drizzle_orm_1.eq)(schema_1.mentorshipCategory.id, input.id))
                    .returning();
                return category;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateMentorShipCategory(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const category = await _drizzle_1.db.query.mentorshipCategory.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorshipCategory.id, input.id)),
                });
                console.log(input);
                const createFeedBack = await _drizzle_1.db
                    .insert(schema_1.mentorshipCategory)
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
        async addMentorShipSkills(_, { input }, context) {
            try {
                console.log(input);
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, exports.userOrg)(data.id);
                const set = await _drizzle_1.db.query.mentorshipSkills.findFirst({
                    where: (mentorShipSkills, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipSkills.organization, userOrgId), eq(mentorShipSkills.title, input.title)),
                });
                console.log(set);
                if (set) {
                    return new graphql_1.GraphQLError('Skill AllReady exist', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                const createOrganization = await _drizzle_1.db
                    .insert(schema_1.mentorshipSkills)
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
        async deleteMentorShipSkills(_, { input }, context) {
            try {
                console.log(input);
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, exports.userOrg)(data.id);
                const category = await _drizzle_1.db
                    .delete(schema_1.mentorshipSkills)
                    .where((0, drizzle_orm_1.eq)(schema_1.mentorshipSkills.id, input.id))
                    .returning();
                return category;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateMentorShipSkills(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const category = await _drizzle_1.db.query.mentorshipSkills.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorshipSkills.id, input.id)),
                });
                console.log(input);
                const createFeedBack = await _drizzle_1.db
                    .insert(schema_1.mentorshipSkills)
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
    },
};
exports.mentorShipResolvers = mentorShipResolvers;
