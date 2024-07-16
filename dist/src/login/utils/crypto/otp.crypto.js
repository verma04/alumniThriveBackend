"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptOtp = exports.encryptOtp = void 0;
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPTION_TOKEN);
const encryptOtp = (otp) => {
    const encrypted = cryptr.encrypt(otp);
    return encrypted;
};
exports.encryptOtp = encryptOtp;
const decryptOtp = (otp) => {
    const decrypted = cryptr.decrypt(otp);
    console.log(decrypted);
    return decrypted;
};
exports.decryptOtp = decryptOtp;
