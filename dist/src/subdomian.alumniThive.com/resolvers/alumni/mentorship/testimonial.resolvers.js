"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialsResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const domianCheck_1 = __importDefault(require("../../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const uniqueSlug = require('unique-slug');
var servicesType;
(function (servicesType) {
    servicesType["1:1 Call"] = "1:1 Call";
    servicesType["Subscription"] = "Subscription";
    servicesType["Webinar"] = "Webinar";
})(servicesType || (servicesType = {}));
var priceType;
(function (priceType) {
    priceType["free"] = "free";
    priceType["paid"] = "paid";
})(priceType || (priceType = {}));
const getOrganizationUser = async (id, org_id) => {
    const user = await _drizzle_1.db.query.mentorShip.findFirst({
        where: (mentorShip, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShip.user, id), eq(mentorShip.organization, org_id)),
    });
    return user;
};
const testimonialsResolvers = {
    Query: {
        async getAllMentorTestimonial(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await getOrganizationUser(data.id, org_id);
                const testimonial = await _drizzle_1.db.query.mentorShipTestimonials.findMany({
                    where: (mentorShipTestimonials, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipTestimonials.mentorShip, user.id)),
                    orderBy: (mentorShipTestimonials, { desc }) => [
                        desc(mentorShipTestimonials.createdAt),
                    ],
                });
                console.log(testimonial);
                return testimonial;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addMentorShipTestimonials(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await getOrganizationUser(data.id, org_id);
                const testimonial = await _drizzle_1.db
                    .insert(schema_1.mentorShipTestimonials)
                    .values({
                    testimonial: input.testimonial,
                    from: input.from,
                    mentorShip: user.id,
                })
                    .returning();
                return testimonial;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateMentorShipTestimonials(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const testimonial = await _drizzle_1.db.query.mentorShipTestimonials.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorShipTestimonials.id, input.id)),
                });
                delete testimonial['id'];
                const createTestimonial = await _drizzle_1.db
                    .insert(schema_1.mentorShipTestimonials)
                    .values({
                    ...testimonial,
                })
                    .returning();
                return createTestimonial;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.testimonialsResolvers = testimonialsResolvers;
