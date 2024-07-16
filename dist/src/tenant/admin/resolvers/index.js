"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_resolvers_1 = require("./admin/admin.resolvers");
const organization_resolvers_1 = require("./admin/organization.resolvers");
const graphql_upload_1 = require("graphql-upload");
const user_resolvers_1 = require("./admin/user.resolvers");
const payments_resolvers_1 = require("./payments/payments.resolvers");
const mentorship_resolvers_1 = require("./admin/mentorship.resolvers");
const alumnistories_resolvers_1 = require("./admin/alumnistories.resolvers");
const giving_reslovers_1 = require("./admin/giving.reslovers");
const website_1 = __importDefault(require("./website"));
const domain_resolvers_1 = require("./admin/domain.resolvers");
const group_1 = __importDefault(require("./admin/group"));
const faq_resolvers_1 = require("./admin/faq.resolvers");
const resolvers = {
    Upload: graphql_upload_1.GraphQLUpload,
    Query: {
        ...admin_resolvers_1.adminResolvers.Query,
        ...organization_resolvers_1.organizationResolvers.Query,
        ...user_resolvers_1.userResolvers.Query,
        ...payments_resolvers_1.paymentResolvers.Query,
        ...mentorship_resolvers_1.mentorShipResolvers.Query,
        ...alumnistories_resolvers_1.alumniStoriesResolvers.Query,
        ...giving_reslovers_1.givingResolvers.Query,
        ...website_1.default.Query,
        ...domain_resolvers_1.domainResolvers.Query,
        ...group_1.default.Query,
        ...faq_resolvers_1.faqResolvers.Query,
    },
    Mutation: {
        ...admin_resolvers_1.adminResolvers.Mutation,
        ...organization_resolvers_1.organizationResolvers.Mutation,
        ...user_resolvers_1.userResolvers.Mutation,
        ...payments_resolvers_1.paymentResolvers.Mutation,
        ...mentorship_resolvers_1.mentorShipResolvers.Mutation,
        ...alumnistories_resolvers_1.alumniStoriesResolvers.Mutation,
        ...giving_reslovers_1.givingResolvers.Mutation,
        ...website_1.default.Mutation,
        ...domain_resolvers_1.domainResolvers.Mutation,
        ...group_1.default.Mutation,
        ...faq_resolvers_1.faqResolvers.Mutation,
    },
};
exports.default = resolvers;
