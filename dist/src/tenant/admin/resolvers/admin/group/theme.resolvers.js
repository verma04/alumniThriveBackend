"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const mentorship_resolvers_1 = require("../mentorship.resolvers");
const _drizzle_1 = require("../../../../../@drizzle");
const graphql_1 = require("graphql");
const schema_1 = require("../../../../../@drizzle/src/db/schema");
const themeResolvers = {
    Query: {
        async getAllGroupTheme(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const theme = await _drizzle_1.db.query.groupTheme.findMany({
                    where: (groupTheme, { eq }) => eq(groupTheme.organization, userOrgId),
                    orderBy: (groupTheme, { desc }) => [
                        desc(groupTheme.createdAt),
                    ],
                });
                return theme;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addGroupTheme(_, { input }, context) {
            try {
                console.log(input);
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const set = await _drizzle_1.db.query.groupTheme.findFirst({
                    where: (groupTheme, { eq }) => (0, drizzle_orm_1.and)(eq(groupTheme.organization, userOrgId), eq(groupTheme.title, input.title)),
                });
                if (set) {
                    return new graphql_1.GraphQLError("The theme name 'AllReady' already exists", {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                const newGroupTheme = await _drizzle_1.db
                    .insert(schema_1.groupTheme)
                    .values({
                    title: input.title,
                    organization: userOrgId,
                })
                    .returning();
                return newGroupTheme;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async deleteGroupTheme(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, mentorship_resolvers_1.userOrg)(data.id);
                const theme = await _drizzle_1.db
                    .delete(schema_1.groupTheme)
                    .where((0, drizzle_orm_1.eq)(schema_1.groupTheme.id, input.id))
                    .returning();
                return {
                    id: input.id,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateGroupTheme(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const theme = await _drizzle_1.db.query.groupTheme.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupTheme.id, input.id)),
                });
                const newTheme = await _drizzle_1.db
                    .insert(schema_1.groupTheme)
                    .values({
                    organization: theme.organization,
                    title: `${theme.title}-copy-1`,
                })
                    .returning();
                return newTheme;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async editGroupTheme(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(id);
                const theme = await _drizzle_1.db
                    .update(schema_1.groupTheme)
                    .set({ title: input.title })
                    .where((0, drizzle_orm_1.eq)(schema_1.groupTheme.id, input.id))
                    .returning();
                return theme[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.themeResolvers = themeResolvers;
