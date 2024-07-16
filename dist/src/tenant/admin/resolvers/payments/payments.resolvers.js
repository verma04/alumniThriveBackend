"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentResolvers = void 0;
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../../@drizzle/src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const paymentResolvers = {
    Query: {
        async checkPaymentDetails(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const findUser = await _drizzle_1.db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                    with: {
                        organization: {
                            with: {
                                razorpay: true,
                                stripe: true,
                            },
                        },
                    },
                });
                console.log(findUser);
                return {
                    enabledRazorpay: findUser?.organization?.razorpay?.isEnabled,
                    enabledStripe: findUser?.organization?.stripe?.isEnabled,
                    razorpayKeyId: findUser?.organization?.razorpay?.keyID,
                    razorpayKeySecret: findUser?.organization?.razorpay?.keySecret,
                    stripeKeyId: findUser?.organization?.stripe?.keyID,
                    stripeKeySecret: findUser?.organization?.stripe?.keySecret,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addPaymentDetails(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const findUser = await _drizzle_1.db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                    with: {
                        organization: true,
                    },
                });
                console.log(input);
                if (input.enabledRazorpay) {
                    await _drizzle_1.db
                        .update(schema_1.razorpay)
                        .set({
                        keyID: input.razorpayKeyId,
                        isEnabled: input.enabledRazorpay,
                        keySecret: input.razorpayKeySecret,
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.razorpay.organization, findUser.organization.id));
                }
                if (input.enabledStripe) {
                    await _drizzle_1.db
                        .update(schema_1.stripe)
                        .set({
                        keyID: input.stripeKeyId,
                        keySecret: input.stripeKeySecret,
                        isEnabled: input.enabledStripe,
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.stripe.organization, findUser.organization.id));
                }
                // const createRazorpay = await db
                //   .insert(razorpay)
                //   .values({
                //     organization: findUser.organization.id,
                //     keyID: input.keyId,
                //     keySecret: input.keySecret,
                //   })
                //   .returning();
                // const createPayment = await db
                //   .insert(razorpay)
                //   .values({
                //     organization: findUser.organization.id,
                //     keyID: input.keyId,
                //     keySecret: input.keySecret,
                //   })
                //   .returning();
                // if (createPayment) {
                //   return {
                //     success: true,
                //   };
                // }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.paymentResolvers = paymentResolvers;
