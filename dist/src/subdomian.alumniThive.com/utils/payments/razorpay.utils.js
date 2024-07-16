"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayUtils = void 0;
const _drizzle_1 = require("../../../@drizzle");
const drizzle_orm_1 = require("drizzle-orm");
const Razorpay = require('razorpay');
const razorpayUtils = async (orgId) => {
    const organization = await _drizzle_1.db.query.razorpay.findFirst({
        where: (razorpay, { eq }) => (0, drizzle_orm_1.and)(eq(razorpay.organization, orgId)),
    });
    console.log(organization);
    const razorpay = new Razorpay({
        key_id: organization.keyID,
        key_secret: organization.keySecret,
    });
    return { razorpay, key_id: organization.keyID };
};
exports.razorpayUtils = razorpayUtils;
