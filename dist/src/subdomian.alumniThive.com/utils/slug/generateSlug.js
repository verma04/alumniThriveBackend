"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const nanoid_1 = require("nanoid");
const generateSlug = (slug) => {
    const output = (0, slugify_1.default)(slug, {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    return `${output}-${(0, nanoid_1.nanoid)(10)}`;
};
exports.default = generateSlug;
