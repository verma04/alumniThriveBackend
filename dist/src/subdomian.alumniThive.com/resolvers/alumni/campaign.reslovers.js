"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignResolvers = void 0;
const graphql_1 = require("graphql");
const _drizzle_1 = require("../../../@drizzle");
const schema_1 = require("../../../@drizzle/src/db/schema");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const drizzle_orm_1 = require("drizzle-orm");
const generateSlug_1 = __importDefault(require("../../utils/slug/generateSlug"));
const upload_utils_1 = __importDefault(require("../../utils/upload/upload.utils"));
const paymentResponse_utils_1 = __importDefault(require("../../utils/payments/paymentResponse.utils"));
const campaignResolvers = {
    Query: {
        async getCampaignByID(_, { domain, id }, context) {
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
                const story = await _drizzle_1.db.query.campaign.findFirst({
                    where: (d, { eq }) => (0, drizzle_orm_1.and)(eq(d.organization, findDomain.organizationId), eq(d.isApproved, true), eq(d.slug, id)),
                    with: {
                        category: true,
                        user: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                console.log(story);
                return story;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getApprovedCampaign(_, { domain }, context) {
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
                const story = await _drizzle_1.db.query.campaign.findMany({
                    where: (d, { eq }) => (0, drizzle_orm_1.and)(eq(d.organization, findDomain.organizationId), eq(d.isApproved, true)),
                    with: {
                        category: true,
                        user: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.campaign.createdAt)],
                });
                console.log(story, 'sdsdsd');
                return story;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getCampaignCategory(_, { domain }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.alumniStoryCategory.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniStoryCategory.organization, org_id)),
                    with: {
                        alumniStory: true,
                    },
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.alumniStory.createdAt)],
                });
                console.log(find);
                return find;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getMyCampaign(_, { domain }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.alumniStory.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniStory.user, id)),
                    with: {
                        category: true,
                    },
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.alumniStory.createdAt)],
                });
                return find;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addFundCampaign(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input);
                const slug = (0, generateSlug_1.default)(input.title);
                let cover;
                if (input.cover) {
                    cover = await (0, upload_utils_1.default)(input.cover);
                }
                console.log(slug, cover);
                await _drizzle_1.db.insert(schema_1.campaign).values({
                    category: input.category,
                    title: input.title,
                    organization: org_id,
                    slug: slug,
                    isApproved: false,
                    shortDescription: input.shortDescription,
                    description: input.description,
                    cover: cover ? cover : 'groups-default-cover-photo.jpg',
                    user: id,
                    campaignType: input.campaignType,
                    amount: input.amount,
                    endDate: input.endDate,
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async campaignFundPayment(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const response = await (0, paymentResponse_utils_1.default)(org_id, input.amount);
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.campaignResolvers = campaignResolvers;
