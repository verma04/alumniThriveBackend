"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsResolvers = void 0;
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const mentorship_resolvers_1 = require("../mentorship.resolvers");
const _drizzle_1 = require("../../../../../@drizzle");
const schema_1 = require("../../../../../@drizzle/src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const settingsResolvers = {
    Query: {
        async getGroupSettings(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const settings = await _drizzle_1.db.query.organizationSettingsGroups.findFirst({
                    where: (organizationSettingsGroups, { eq }) => eq(organizationSettingsGroups.organization, userOrgId),
                });
                const isTrending = await _drizzle_1.db.query.trendingConditionsGroups.findFirst({
                    where: (trendingConditionsGroups, { eq }) => eq(trendingConditionsGroups.organization, userOrgId),
                });
                return {
                    autoApprove: settings.autoApprove,
                    ...isTrending,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async updateGroupSettings(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                console.log(input);
                const settings = await _drizzle_1.db
                    .update(schema_1.organizationSettingsGroups)
                    .set({ autoApprove: input.autoApprove })
                    .where((0, drizzle_orm_1.eq)(schema_1.organizationSettingsGroups.organization, userOrgId))
                    .returning();
                const trendingSettings = await _drizzle_1.db
                    .update(schema_1.trendingConditionsGroups)
                    .set({
                    user: input.user,
                    discussion: input.discussion,
                    views: input.views,
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.trendingConditionsGroups.organization, userOrgId))
                    .returning();
                return {
                    autoApprove: settings[0].autoApprove,
                    ...trendingSettings[0],
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.settingsResolvers = settingsResolvers;
