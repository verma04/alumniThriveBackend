"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalResolvers = void 0;
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const mentorship_resolvers_1 = require("../mentorship.resolvers");
const _drizzle_1 = require("../../../../../@drizzle");
const schema_1 = require("../../../../../@drizzle/src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const approvalResolvers = {
    Query: {
        async getAllGroupStatus(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const { all, isApproved, isBlocked, isPaused, isRejected, isFeatured, } = input;
                if (all) {
                    const group = await _drizzle_1.db.query.groups.findMany({
                        where: (groups, { eq }) => eq(groups.organization, userOrgId),
                        orderBy: (groups, { desc }) => [desc(groups.createdAt)],
                        with: {
                            theme: true,
                            interest: true,
                            setting: true,
                        },
                    });
                    return group;
                }
                else {
                    const group = await _drizzle_1.db.query.groups.findMany({
                        where: (groups, { eq }) => (0, drizzle_orm_1.and)(eq(groups.organization, userOrgId), eq(groups.isApproved, isApproved ? isApproved : false), eq(groups.isBlocked, isBlocked ? isBlocked : false), eq(groups.isRejected, isRejected ? isRejected : false), eq(groups.isPaused, isPaused ? isPaused : false), eq(groups.isFeatured, isFeatured ? isFeatured : false)),
                        orderBy: (groups, { desc }) => [desc(groups.createdAt)],
                        with: {
                            theme: true,
                            interest: true,
                            setting: true,
                        },
                    });
                    return group;
                }
                // const groupInterests = await db.query.groupInterests.findMany({
                //   where: (groupInterests, { eq }) =>
                //     eq(groupInterests.organization, userOrgId),
                //   orderBy: (groupInterests, { desc }) => [
                //     desc(groupInterests.createdAt),
                //   ],
                // });
                // return groupInterests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addFeaturedGroup(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                console.log(input);
                if (input.length === 0) {
                    return;
                }
                await _drizzle_1.db
                    .update(schema_1.groups)
                    .set({ isFeatured: true })
                    .where((0, drizzle_orm_1.inArray)(schema_1.groups.id, input));
                // const groupInterests = await db.query.groupInterests.findMany({
                //   where: (groupInterests, { eq }) =>
                //     eq(groupInterests.organization, userOrgId),
                //   orderBy: (groupInterests, { desc }) => [
                //     desc(groupInterests.createdAt),
                //   ],
                // });
                // return groupInterests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.approvalResolvers = approvalResolvers;
