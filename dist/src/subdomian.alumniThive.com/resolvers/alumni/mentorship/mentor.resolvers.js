"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const domianCheck_1 = __importDefault(require("../../../../commanUtils/domianCheck"));
const schema_1 = require("../../../../@drizzle/src/db/schema");
const getOrganizationUser = async (id, org_id) => {
    const user = await _drizzle_1.db.query.mentorShip.findFirst({
        where: (mentorShip, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShip.user, id), eq(mentorShip.organization, org_id)),
    });
    return user;
};
const mentorResolvers = {
    Query: {
        async getAllApprovedMentor(_, {}, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await await _drizzle_1.db.query.mentorShip.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorShip.isApproved, true), (0, drizzle_orm_1.eq)(schema_1.mentorShip.organization, org_id)),
                    with: {
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
                return find;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllMentorServicesByID(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await getOrganizationUser(data.id, org_id);
                const find = await await _drizzle_1.db.query.mentorShipService.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorShipService.mentorShip, input.id)),
                });
                return find;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getMentorProfileBySlug(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await await _drizzle_1.db.query.mentorShip.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorShip.slug, input.id), (0, drizzle_orm_1.eq)(schema_1.mentorShip.organization, org_id)),
                    with: {
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
exports.mentorResolvers = mentorResolvers;
