"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = void 0;
const tempEmailDomains = [
    'mailinator.com',
    'duck.com',
    'gmail.com',
    'outlook.com',
    // add more temp email domains here
];
const checkEmail = (email) => {
    const domain = email.split('@')[1];
    console.log(domain);
    return tempEmailDomains.includes(domain);
};
exports.checkEmail = checkEmail;
