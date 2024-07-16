"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_crypto_1 = require("./crypto/jwt.crypto");
const generateJwtToken = async (user) => {
    console.log(user.id);
    const jwtToken = await jsonwebtoken_1.default.sign({
        id: user.userId,
    }, process.env.JWT_TOKEN, { expiresIn: '1555555555555555555555555555555555555555555555555555h' });
    const encrypt = (0, jwt_crypto_1.encryptToken)(jwtToken);
    return encrypt;
};
exports.default = generateJwtToken;
