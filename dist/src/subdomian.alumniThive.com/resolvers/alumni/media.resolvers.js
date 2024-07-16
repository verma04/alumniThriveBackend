"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const mediaResolvers = {
    Query: {
        async getMediaByGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.media.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.media.groupId, input.group),
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    with: {},
                });
                return find;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {},
};
exports.mediaResolvers = mediaResolvers;
