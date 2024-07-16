"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const generateSlug = async () => {
    return (0, nanoid_1.nanoid)(10);
};
exports.default = generateSlug;
