"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const alumniResolvers = {
    Query: {
        async getAllConnection(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.id)),
                });
                const host = await _drizzle_1.db.query.eventHost.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventHost.eventId, event.id)),
                });
                const user = await _drizzle_1.db.query.alumniToOrganization.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.isApproved, true), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.isRequested, true), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.organizationId, org_id)),
                    with: {
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                });
                const arr = [];
                console.log(user);
                user.forEach(async (t) => {
                    const set = await host.some(({ alumniId }) => t.alumniId === alumniId);
                    if (set) {
                        arr.push({
                            ...t.alumni,
                            isAdded: set,
                        });
                    }
                    else {
                        arr.push({
                            ...t.alumni,
                            isAdded: set,
                        });
                    }
                });
                return arr;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllOrganizationUser(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await _drizzle_1.db.query.alumniToOrganization.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.isApproved, true), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.isRequested, true), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.organizationId, org_id)),
                    with: {
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                });
                console.log(user.map((set) => set.alumni));
                return user.map((set) => set.alumni);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {},
};
exports.alumniResolvers = alumniResolvers;
