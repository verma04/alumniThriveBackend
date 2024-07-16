"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../../@drizzle/src/db/schema");
const domianCheck_1 = __importDefault(require("../../../../commanUtils/domianCheck"));
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: 'rzp_test_LxtWwBs0es58iy',
    key_secret: 'oCxX71pESz5miUDN1BMfgNMH',
});
const bookingResolvers = {
    Query: {
        async checkWebinarPaymentResponse(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const organizationCu = await _drizzle_1.db.query.organization.findFirst({
                    where: (user, { eq }) => eq(schema_1.organization.id, org_id),
                    with: {
                        currency: true,
                    },
                });
                const services = await _drizzle_1.db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipService.id, input.id)),
                });
                if (services.priceType === 'paid') {
                    const options = {
                        amount: Number(services.price) * 100,
                        currency: organizationCu.currency.cc,
                        receipt: 'any unique id for every order',
                        payment_capture: 1,
                    };
                    const response = await razorpay.orders.create(options);
                    return { ...response, payment: true };
                }
                else {
                    return {
                        payment: false,
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getServicesDetails(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const booking = await _drizzle_1.db.query.mentorShipBooking.findFirst({
                    where: (mentorShipBooking, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipBooking.service, input.id), eq(mentorShipBooking.user, data.id)),
                });
                const services = await _drizzle_1.db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipService.id, input.id)),
                    with: {
                        mentorship: {
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
                        },
                    },
                });
                console.log(booking);
                return {
                    booking: {
                        isBooking: booking ? true : false,
                        createdAt: booking ? booking.createdAt : null,
                    },
                    ...services,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async bookPaidWebinar(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const booking = await _drizzle_1.db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipService.id, input.serviceID)),
                    with: {
                        mentorship: true,
                    },
                });
                await _drizzle_1.db.insert(schema_1.mentorShipBooking).values({
                    razorpay_order_id: input.razorpay_order_id,
                    razorpay_payment_id: input.razorpay_payment_id,
                    razorpay_signature: input.razorpay_signature,
                    service: input.serviceID,
                    user: data.id,
                    payment: true,
                    mentor: booking.mentorship.id,
                    isAccepted: true,
                    amount: booking.price,
                });
                return {
                    success: true,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async bookFreeWebinar(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const booking = await _drizzle_1.db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) => (0, drizzle_orm_1.and)(eq(mentorShipService.id, input.serviceID)),
                    with: {
                        mentorship: true,
                    },
                });
                await _drizzle_1.db.insert(schema_1.mentorShipBooking).values({
                    service: input.serviceID,
                    user: data.id,
                    payment: false,
                    isAccepted: true,
                    mentor: booking.mentorship.id,
                });
                return {
                    success: true,
                };
                // const services = await db.query.mentorShipService.findFirst({
                //   where: (mentorShipService, { eq }) =>
                //     and(eq(mentorShipService.id, input.id)),
                // });
                // const options = {
                //   amount: Number(services.price) * 100,
                //   currency: "USD",
                //   receipt: "any unique id for every order",
                //   payment_capture: 1,
                // };
                // const response = await razorpay.orders.create(options);
                // console.log(response);
                // return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.bookingResolvers = bookingResolvers;
