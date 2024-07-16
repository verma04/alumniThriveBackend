"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_types_1 = require("./admin.types");
const alumnistories_types_1 = require("./alumnistories.types");
const domain_types_1 = require("./domain.types");
const faq_types_1 = require("./faq.types");
const giving_types_1 = require("./giving.types");
const group_1 = __importDefault(require("./group"));
const mentorship_types_1 = require("./mentorship.types");
const organization_types_1 = require("./organization.types");
const payments_types_1 = require("./payments.types");
const user_types_1 = require("./user.types");
const website_1 = __importDefault(require("./website"));
const types = [
    admin_types_1.adminTypes,
    organization_types_1.organizationTypes,
    user_types_1.userTypes,
    payments_types_1.paymentsTypes,
    mentorship_types_1.mentorShipTypes,
    alumnistories_types_1.alumniStoriesTypes,
    giving_types_1.givingTypes,
    website_1.default,
    domain_types_1.domainTypes,
    group_1.default,
    faq_types_1.faqTypes,
];
exports.default = types;
