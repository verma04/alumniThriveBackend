"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _drizzle_1 = require("../../../@drizzle");
const schema_1 = require("../../../@drizzle/src/db/schema");
const razorpay_utils_1 = require("./razorpay.utils");
const paymentResponse = async (org_id, amount) => {
    const razorpay = await (0, razorpay_utils_1.razorpayUtils)(org_id);
    const organizationCu = await _drizzle_1.db.query.organization.findFirst({
        where: (user, { eq }) => eq(schema_1.organization.id, org_id),
        with: {
            currency: true,
        },
    });
    const options = {
        amount: Number(amount) * 100,
        currency: organizationCu.currency.cc,
        receipt: 'any unique id for every order',
        payment_capture: 1,
    };
    const response = await razorpay.razorpay.orders.create(options);
    return {
        ...response,
        key_id: razorpay.key_id,
    };
};
exports.default = paymentResponse;
