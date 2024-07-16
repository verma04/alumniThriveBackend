"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const domianCheck_1 = __importDefault(require("../../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const graphql_1 = require("graphql");
const razorpay_utils_1 = require("../../../utils/payments/razorpay.utils");
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
const servicesResolvers = {
    Query: {
        async getAllMentorServices(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await getOrganizationUser(data.id, org_id);
                const services = await _drizzle_1.db.query.mentorShipService.findMany({
                    where: (mentorShipService, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipService.mentorShip, user.id)),
                    orderBy: (mentorShipService, { desc }) => [
                        desc(mentorShipService.createdAt),
                    ],
                });
                return services;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getBookingRequest(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const mentor = await _drizzle_1.db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShip.user, data.id)),
                    orderBy: (mentorShip, { asc }) => [
                        asc(mentorShip.createdAt),
                    ],
                });
                const booking = await _drizzle_1.db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipBooking.mentor, mentor.id)),
                    with: {
                        service: true,
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
                return booking;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getUpcomingBooking(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const mentor = await _drizzle_1.db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShip.user, data.id)),
                });
                const booking = await _drizzle_1.db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipBooking.mentor, mentor.id), eq(mentorShipBooking.isAccepted, true), eq(mentorShipBooking.isCancel, false), eq(mentorShipBooking.isCompleted, false)),
                    with: {
                        service: true,
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
                    orderBy: (mentorShipBooking, { asc }) => [
                        (0, drizzle_orm_1.desc)(mentorShipBooking.createdAt),
                    ],
                });
                console.log(booking);
                return booking;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getCancelledBooking(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const mentor = await _drizzle_1.db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShip.user, data.id)),
                });
                const booking = await _drizzle_1.db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipBooking.mentor, mentor.id), eq(mentorShipBooking.isCancel, true)),
                    orderBy: (mentorShipBooking, { asc }) => [
                        (0, drizzle_orm_1.desc)(mentorShipBooking.createdAt),
                    ],
                    with: {
                        service: true,
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
                console.log(booking);
                return booking;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getCompletedBooking(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const mentor = await _drizzle_1.db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShip.user, data.id)),
                });
                const booking = await _drizzle_1.db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipBooking.mentor, mentor.id), eq(mentorShipBooking.isCompleted, true)),
                    orderBy: (mentorShipBooking, { desc }) => [
                        desc(mentorShipBooking.updatedAt),
                    ],
                    with: {
                        service: true,
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
                return booking;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addMentorShipServices(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await getOrganizationUser(data.id, org_id);
                const services = await _drizzle_1.db
                    .insert(schema_1.mentorShipService)
                    .values({
                    serviceType: input.serviceType,
                    priceType: input.priceType,
                    duration: input.duration,
                    mentorShip: user.id,
                    title: input.title,
                    price: input.price ? input.price : 0,
                    webinarUrl: input.webinarUrl ? input.webinarUrl : '',
                    webinarDate: input.webinarDate ? input.webinarDate : '',
                })
                    .returning();
                return services;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateMentorShipServices(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const service = await _drizzle_1.db.query.mentorShipService.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorShipService.id, input.id)),
                });
                const title = service['title'];
                delete service['id'];
                delete service['title'];
                const createServices = await _drizzle_1.db
                    .insert(schema_1.mentorShipService)
                    .values({
                    title: `${title}-copy-1`,
                    ...service,
                })
                    .returning();
                return createServices;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async acceptBookingRequest(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                console.log(input);
                const accept = await _drizzle_1.db
                    .update(schema_1.mentorShipBooking)
                    .set({ requestStatus: 'ACCEPTED', isAccepted: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.mentorShipBooking.id, input.bookingID))
                    .returning();
                return accept[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async cancelBooking(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const orgId = await (0, domianCheck_1.default)(context);
                const razorpay = await (0, razorpay_utils_1.razorpayUtils)(orgId);
                const booking = await _drizzle_1.db.query.mentorShipBooking.findFirst({
                    where: (mentorShipBooking, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipBooking.id, input.bookingID)),
                });
                if (booking.isCancel) {
                    throw new graphql_1.GraphQLError('Booking AlReady Cancel', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                if (!booking.payment) {
                }
                if (booking.payment) {
                    const cancelBooking = await _drizzle_1.db
                        .update(schema_1.mentorShipBooking)
                        .set({ isCancel: true })
                        .where((0, drizzle_orm_1.eq)(schema_1.mentorShipBooking.id, booking.id))
                        .returning();
                    const refund = await razorpay.razorpay.payments.refund(booking.razorpay_payment_id, {
                        amount: Number(booking.amount) * 100,
                        speed: 'normal',
                        notes: {
                            notes_key_1: 'Beam me up Scotty.',
                            notes_key_2: 'Engage',
                        },
                        receipt: `Cancel booking refund ${booking.id}`,
                    });
                }
                // const accept = await db
                //   .update(mentorShipBooking)
                //   .set({ requestStatus: "ACCEPTED", isAccepted: true })
                //   .where(eq(mentorShipBooking.id, input.bookingID))
                //   .returning();
                // return accept[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async markBookingAsCompleted(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const booking = await _drizzle_1.db.query.mentorShipBooking.findFirst({
                    where: (mentorShipBooking, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipBooking.id, input.bookingID)),
                });
                if (booking.isCompleted) {
                    throw new graphql_1.GraphQLError('Booking AlReady Competed', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const completeBooking = await _drizzle_1.db
                    .update(schema_1.mentorShipBooking)
                    .set({ isCompleted: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.mentorShipBooking.id, booking.id))
                    .returning();
                return completeBooking[0];
                // const accept = await db
                //   .update(mentorShipBooking)
                //   .set({ requestStatus: "ACCEPTED", isAccepted: true })
                //   .where(eq(mentorShipBooking.id, input.bookingID))
                //   .returning();
                // return accept[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.servicesResolvers = servicesResolvers;
