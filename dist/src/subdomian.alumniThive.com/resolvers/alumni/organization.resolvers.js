"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationResolvers = void 0;
const _drizzle_1 = require("../../../@drizzle");
const graphql_1 = require("graphql");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const organizationResolvers = {
    Query: {
        async checkDomain(_, { domain }, context) {
            const findDomain = await _drizzle_1.db.query.domain.findFirst({
                where: (d, { eq }) => eq(d.domain, domain?.split('.')[0]?.replace('http://', '')),
            });
            if (!findDomain) {
                return new graphql_1.GraphQLError('No Domain Found', {
                    extensions: {
                        code: 'NOT FOUND',
                        http: { status: 404 },
                    },
                });
            }
            const findOrg = await _drizzle_1.db.query.organization.findFirst({
                where: (d, { eq }) => eq(d.id, findDomain.organizationId),
                with: {
                    theme: true,
                },
            });
            return findOrg;
        },
        async getUser(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const findOrg = await _drizzle_1.db.query.alumniToOrganization.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, data.id), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.organizationId, org_id)),
                    with: {
                        followers: true,
                        following: true,
                    },
                });
                const findUser = await _drizzle_1.db.query.alumni.findFirst({
                    where: (d, { eq }) => eq(d.id, findOrg.alumniId),
                });
                return {
                    id: findUser.id,
                    firstName: findUser.firstName,
                    lastName: findUser.lastName,
                    email: findUser.email,
                    isApproved: findOrg.isApproved,
                    isRequested: findOrg.isRequested,
                    avatar: findUser.avatar,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getCurrency(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const organizationCu = await _drizzle_1.db.query.organization.findFirst({
                    where: (user, { eq }) => eq(schema_1.organization.id, org_id),
                    with: {
                        currency: true,
                    },
                });
                return organizationCu.currency;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getHomePageCarousel(_, { domain }, context) {
            const findDomain = await _drizzle_1.db.query.domain.findFirst({
                where: (d, { eq }) => eq(d.domain, domain?.split('.')[0]?.replace('http://', '')),
            });
            if (!findDomain) {
                return new graphql_1.GraphQLError('No Domain Found', {
                    extensions: {
                        code: 'NOT FOUND',
                        http: { status: 404 },
                    },
                });
            }
            const findOrg = await _drizzle_1.db.query.organization.findFirst({
                where: (d, { eq }) => eq(d.id, findDomain.organizationId),
                with: {
                    theme: true,
                },
            });
            const sli = await _drizzle_1.db.query.homePageCarousel.findMany({
                where: (d, { eq }) => eq(d.organization, findDomain.organizationId),
            });
            return sli;
        },
        async getHeaderLinks(_, { domain }, context) {
            try {
                const findDomain = await _drizzle_1.db.query.domain.findFirst({
                    where: (d, { eq }) => eq(d.domain, domain?.split('.')[0]?.replace('http://', '')),
                });
                if (!findDomain) {
                    return new graphql_1.GraphQLError('No Domain Found', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 404 },
                        },
                    });
                }
                const findOrg = await _drizzle_1.db.query.organization.findFirst({
                    where: (d, { eq }) => eq(d.id, findDomain.organizationId),
                    with: {
                        theme: true,
                    },
                });
                const links = await _drizzle_1.db.query.headerLinks.findMany({
                    where: (d, { eq }) => eq(d.organization, findDomain.organizationId),
                    orderBy: (headerLinks, { asc }) => [asc(headerLinks.sort)],
                });
                return links;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getOrganizationTag(_, { domain }, context) {
            try {
                const org = await (0, domianCheck_1.default)(context);
                const tags = await _drizzle_1.db.query.organizationTag.findMany({
                    where: (d, { eq }) => eq(d.organization, schema_1.organizationTag.organization),
                });
                return tags;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getModuleFaq(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const faqs = await _drizzle_1.db.query.moduleFaqs.findMany({
                    where: (d, { eq }) => (0, drizzle_orm_1.and)(eq(d.organization, org_id), eq(d.faqModule, input.module)),
                    orderBy: (moduleFaqs, { asc }) => [asc(moduleFaqs.sort)],
                });
                return faqs;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async completeKyc(_, { input }, context) {
            try {
                const { affliction, referralSource, comment, agreement, identificationNumber, } = input;
                const data = await (0, checkAuth_utils_1.default)(context);
                const findOrg = await _drizzle_1.db.query.alumniToOrganization.findFirst({
                    where: (d, { eq }) => eq(d.alumniId, data.id),
                });
                await _drizzle_1.db.insert(schema_1.alumniKyc).values({
                    affliction: affliction,
                    referralSource: referralSource,
                    comment: comment,
                    agreement: agreement,
                    orgId: findOrg.organizationId,
                });
                const datas = await _drizzle_1.db
                    .update(schema_1.alumniToOrganization)
                    .set({ isRequested: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, data.id))
                    .returning();
                return {
                    success: true,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.organizationResolvers = organizationResolvers;
