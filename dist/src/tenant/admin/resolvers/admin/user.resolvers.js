"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const userResolvers = {
    Query: {
        async getAllUser(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const findUser = await _drizzle_1.db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                    with: {
                        organization: {
                            with: {},
                        },
                    },
                });
                const result = await _drizzle_1.db.query.alumniToOrganization.findMany({
                    where: (user, { eq }) => eq(user.organizationId, findUser.organization.id),
                    with: {
                        alumni: true,
                        alumniKyc: true,
                    },
                });
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async approveUser(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.userResolvers = userResolvers;
