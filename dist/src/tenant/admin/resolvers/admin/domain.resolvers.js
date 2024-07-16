"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const mentorship_resolvers_1 = require("./mentorship.resolvers");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const checkDomainCName = async (domain) => {
    const response = await fetch(`https://networkcalc.com/api/dns/lookup/${domain.domain}`);
    const res = await response.json();
    console.log(res);
    if (res?.records?.CNAME) {
        if (res?.records?.CNAME[0]?.address === 'thrico.network') {
            await _drizzle_1.db
                .update(schema_1.customDomain)
                .set({ dnsConfig: true, status: true })
                .where((0, drizzle_orm_1.eq)(schema_1.customDomain.id, domain.id));
        }
    }
};
const checkSSl = async (domain) => {
    const response = await fetch(`https://ssl-checker.io/api/v1/check/${domain.domain}`);
    const res = await response.json();
    console.log(res);
    if (res?.result.response !== 'failed') {
        await _drizzle_1.db
            .update(schema_1.customDomain)
            .set({ ssl: true })
            .where((0, drizzle_orm_1.eq)(schema_1.customDomain.id, domain.id));
    }
};
const domainResolvers = {
    Query: {
        async getCustomDomain(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const domain = await _drizzle_1.db.query.customDomain.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.customDomain.organization, userOrgId),
                });
                return domain;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async checkDomainIsVerified(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const domain = await _drizzle_1.db.query.customDomain.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.customDomain.organization, userOrgId),
                });
                if (domain) {
                    if (!domain?.status)
                        checkDomainCName(domain);
                    if (!domain?.ssl)
                        checkSSl(domain);
                }
                return domain;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async updateDomain(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const createCustomDomain = await _drizzle_1.db
                    .insert(schema_1.customDomain)
                    .values({
                    domain: input.domain,
                    organization: userOrgId,
                })
                    .returning();
                return createCustomDomain[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async deleteDomain(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                await _drizzle_1.db
                    .delete(schema_1.customDomain)
                    .where((0, drizzle_orm_1.eq)(schema_1.customDomain.organization, userOrgId));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.domainResolvers = domainResolvers;
