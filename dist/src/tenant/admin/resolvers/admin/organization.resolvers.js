"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationResolvers = void 0;
const _drizzle_1 = require("../../../../@drizzle");
const graphql_1 = require("graphql");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../../@drizzle/src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const upload_utils_1 = __importDefault(require("../../utils/upload/upload.utils"));
const mentorship_resolvers_1 = require("./mentorship.resolvers");
const organizationResolvers = {
    Query: {
        async getOrganization(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const checkUser = await _drizzle_1.db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data?.id),
                    with: {
                        organization: true,
                        profileInfo: true,
                    },
                });
                return checkUser;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async checkDomain(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const findDomain = await _drizzle_1.db.query.domain.findFirst({
                    where: (user, { eq }) => eq(user.domain, input.domain),
                });
                if (findDomain) {
                    return new graphql_1.GraphQLError('Sorry, that domain already exists. Please try a different one.', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                return {
                    success: true,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getCurrency(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const currency = await _drizzle_1.db.query.currency.findMany();
                return currency;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getOrganizationCurrency(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const orgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const organizationCu = await _drizzle_1.db.query.organization.findFirst({
                    where: (user, { eq }) => eq(schema_1.organization.id, orgId),
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
    },
    Mutation: {
        async registerOrganization(_, { input }, context) {
            try {
                const { phone, designation, domain: organizationDomain, address, organizationName, category, timeZone, logo, website, } = input;
                const data = await (0, checkAuth_utils_1.default)(context);
                let uploadedLogo;
                if (logo) {
                    uploadedLogo = await (0, upload_utils_1.default)(logo);
                }
                const checkUser = await _drizzle_1.db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data?.id),
                    with: {
                        organization: true,
                        profileInfo: true,
                    },
                });
                if (checkUser.organization) {
                    return {
                        success: true,
                    };
                }
                const findDomain = await _drizzle_1.db.query.domain.findFirst({
                    where: (user, { eq }) => eq(user.domain, organizationDomain),
                });
                if (findDomain) {
                    return new graphql_1.GraphQLError('Sorry, that domain already exists. Please try a different one.', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                const createOrganization = await _drizzle_1.db
                    .insert(schema_1.organization)
                    .values({
                    address,
                    category,
                    timeZone,
                    logo: uploadedLogo ? uploadedLogo : "Thrico_LogoMark_Color.png",
                    organizationName,
                    website,
                    userId: checkUser.id,
                    favicon: uploadedLogo,
                })
                    .returning();
                await _drizzle_1.db.insert(schema_1.theme).values({
                    organizationId: createOrganization[0]?.id,
                });
                await _drizzle_1.db.insert(schema_1.razorpay).values({
                    isEnabled: false,
                    organization: createOrganization[0]?.id,
                });
                await _drizzle_1.db.insert(schema_1.organizationSettings).values({
                    organization: createOrganization[0]?.id,
                });
                await _drizzle_1.db.insert(schema_1.organizationSettingsGroups).values({
                    organization: createOrganization[0]?.id,
                    autoApprove: false,
                });
                await _drizzle_1.db.insert(schema_1.trendingConditionsGroups).values({
                    organization: createOrganization[0]?.id,
                });
                await _drizzle_1.db.insert(schema_1.stripe).values({
                    isEnabled: false,
                    organization: createOrganization[0]?.id,
                });
                await _drizzle_1.db.insert(schema_1.orgSocialMedia).values({
                    organization: createOrganization[0]?.id,
                });
                await _drizzle_1.db
                    .insert(schema_1.domain)
                    .values({
                    organizationId: createOrganization[0]?.id,
                    domain: organizationDomain,
                })
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
        async changeThemeColor(_, { input }, context) {
            try {
                const { colorPrimary, borderRadius, colorBgContainer } = input;
                const data = await (0, checkAuth_utils_1.default)(context);
                const findUser = await _drizzle_1.db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                    with: {
                        organization: true,
                    },
                });
                const updateTheme = await _drizzle_1.db
                    .update(schema_1.theme)
                    .set({ colorPrimary, borderRadius, colorBgContainer })
                    .where((0, drizzle_orm_1.eq)(schema_1.theme.organizationId, findUser?.organization.id))
                    .returning();
                console.log(updateTheme);
                return updateTheme[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async updateCurrency(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const orgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const updatedCurrency = await _drizzle_1.db
                    .update(schema_1.organization)
                    .set({ currency: input.id })
                    .where((0, drizzle_orm_1.eq)(schema_1.organization.id, orgId))
                    .returning();
                console.log(updatedCurrency);
                return updatedCurrency[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.organizationResolvers = organizationResolvers;
