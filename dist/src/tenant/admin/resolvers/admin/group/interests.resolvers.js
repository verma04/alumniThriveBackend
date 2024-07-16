"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interestsResolvers = void 0;
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const mentorship_resolvers_1 = require("../mentorship.resolvers");
const _drizzle_1 = require("../../../../../@drizzle");
const graphql_1 = require("graphql");
const schema_1 = require("../../../../../@drizzle/src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const interestsResolvers = {
    Query: {
        async getAllGroupInterests(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const groupInterests = await _drizzle_1.db.query.groupInterests.findMany({
                    where: (groupInterests, { eq }) => eq(groupInterests.organization, userOrgId),
                    orderBy: (groupInterests, { desc }) => [
                        desc(groupInterests.createdAt),
                    ],
                });
                return groupInterests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addGroupInterests(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const set = await _drizzle_1.db.query.groupInterests.findFirst({
                    where: (groupInterests, { eq }) => (0, drizzle_orm_1.and)(eq(groupInterests.organization, userOrgId), eq(groupInterests.title, input.title)),
                });
                if (set) {
                    return new graphql_1.GraphQLError("The Interests name 'AllReady' already exists", {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                const newGroupInterests = await _drizzle_1.db
                    .insert(schema_1.groupInterests)
                    .values({
                    title: input.title,
                    organization: userOrgId,
                })
                    .returning();
                return newGroupInterests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async deleteGroupInterests(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, mentorship_resolvers_1.userOrg)(data.id);
                const interests = await _drizzle_1.db
                    .delete(schema_1.groupInterests)
                    .where((0, drizzle_orm_1.eq)(schema_1.groupInterests.id, input.id))
                    .returning();
                return interests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateGroupInterests(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const interests = await _drizzle_1.db.query.groupInterests.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupInterests.id, input.id)),
                });
                console.log(input);
                const newInterests = await _drizzle_1.db
                    .insert(schema_1.groupInterests)
                    .values({
                    organization: interests.organization,
                    title: `${interests.title}-copy-1`,
                })
                    .returning();
                return newInterests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async editGroupInterests(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const interests = await _drizzle_1.db
                    .update(schema_1.groupInterests)
                    .set({ title: input.title })
                    .where((0, drizzle_orm_1.eq)(schema_1.groupInterests.id, schema_1.groupInterests.id))
                    .returning();
                return interests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.interestsResolvers = interestsResolvers;
