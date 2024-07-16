"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const domianCheck_1 = __importDefault(require("../../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const _drizzle_1 = require("../../../../@drizzle");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const tagResolvers = {
    Query: {
        async getProfileTag(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await _drizzle_1.db.query.alumniToOrganization.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, id), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.organizationId, org_id)),
                });
                return user.tag;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async editProfileTag(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input);
                const updated = await _drizzle_1.db
                    .update(schema_1.alumniToOrganization)
                    .set({ tag: input.tag })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, id), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.organizationId, org_id)))
                    .returning();
                return updated[0].tag;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.tagResolvers = tagResolvers;
