"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _drizzle_1 = require("../../../@drizzle");
const schema_1 = require("../../../@drizzle/src/db/schema");
const otp_crypto_1 = require("./crypto/otp.crypto");
const { v4: uuidv4 } = require('uuid');
const resend_1 = require("resend");
const resend = new resend_1.Resend('re_ffA6ZDsH_2zRWoE7frNLJMPNWny4dGpaV;');
const otp_queue_1 = __importDefault(require("../../../queue/otp.queue"));
const sendOtp = async (check) => {
    try {
        const generateOpt = Math.floor(1000 + Math.random() * 9000);
        const encryptedOtp = await (0, otp_crypto_1.encryptOtp)(generateOpt);
        const data = await _drizzle_1.db
            .insert(schema_1.otp)
            .values({ userId: check.id, otp: encryptedOtp })
            .returning();
        (0, otp_queue_1.default)(check.email, generateOpt);
        return data[0];
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = sendOtp;
