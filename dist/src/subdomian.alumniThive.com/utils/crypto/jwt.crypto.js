"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptToken = exports.encryptToken = void 0;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey', {
    encoding: 'base64',
    pbkdf2Iterations: 10,
    saltLength: 5,
});
const encryptToken = (data) => {
    const encrypted = cryptr.encrypt(`Bearer ${data}`);
    return encrypted;
};
exports.encryptToken = encryptToken;
const decryptToken = (data) => {
    try {
        const decrypted = cryptr.decrypt(data);
        return decrypted;
    }
    catch (error) {
        return null;
    }
};
exports.decryptToken = decryptToken;
