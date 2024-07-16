"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _drizzle_1 = require("../../@drizzle");
const schema_1 = require("../../@drizzle/src/db/schema");
const otp_crypto_1 = require("./crypto/otp.crypto");
const { v4: uuidv4 } = require('uuid');
const sendOtp = async (check) => {
    try {
        const generateOpt = Math.floor(1000 + Math.random() * 9000);
        console.log(generateOpt);
        const encryptedOtp = await (0, otp_crypto_1.encryptOtp)(generateOpt);
        const data = await _drizzle_1.db
            .insert(schema_1.otp)
            .values({ userId: check.id, otp: encryptedOtp })
            .returning();
        console.log(data);
        return data[0];
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = sendOtp;
