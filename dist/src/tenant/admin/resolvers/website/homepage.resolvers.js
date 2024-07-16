"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homePageResolvers = void 0;
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../../@drizzle/src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const mentorship_resolvers_1 = require("../admin/mentorship.resolvers");
const uploadImageToFolder_utils_1 = __importDefault(require("../../utils/upload/uploadImageToFolder.utils"));
const homePageResolvers = {
    Query: {
        async getHomePageCarousel(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const carousel = await _drizzle_1.db.query.homePageCarousel.findFirst({
                    where: (homePageCarousel, { eq }) => eq(homePageCarousel.organization, userOrgId),
                });
                return carousel;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getHeaderLinks(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const links = await _drizzle_1.db.query.headerLinks.findMany({
                    where: (headerLinks, { eq }) => eq(headerLinks.organization, userOrgId),
                    orderBy: (headerLinks, { asc }) => [asc(headerLinks.sort)],
                });
                return links;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getSocialMedia(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const socialMedia = await _drizzle_1.db.query.orgSocialMedia.findFirst({
                    where: (orgSocialMedia, { eq }) => eq(orgSocialMedia.organization, userOrgId),
                });
                return socialMedia;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getCustomPages(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const pages = await _drizzle_1.db.query.customPages.findMany({
                    where: (customPages, { eq }) => eq(customPages.organization, userOrgId),
                });
                return pages;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async updateHomePageCarousel(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const set = input.map((set) => set.url);
                const upload = await (0, uploadImageToFolder_utils_1.default)(userOrgId, set);
                console.log(upload);
                const org = upload.map((set) => ({
                    image: set.file,
                    organization: userOrgId,
                }));
                const createOrganization = await _drizzle_1.db
                    .insert(schema_1.homePageCarousel)
                    .values(org)
                    .returning();
                console.log(createOrganization);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async updateSocialMedia(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                console.log(input);
                const { twitter, linkedin, youtube, instagram } = input;
                const update = await _drizzle_1.db
                    .update(schema_1.orgSocialMedia)
                    .set({ twitter, linkedin, youtube, instagram })
                    .where((0, drizzle_orm_1.eq)(schema_1.orgSocialMedia.organization, userOrgId))
                    .returning();
                return update[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async updateHeaderLinks(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                console.log(input);
                const opt = input.map((set, index) => ({
                    sort: index,
                    ...set,
                    organization: userOrgId,
                }));
                await _drizzle_1.db
                    .delete(schema_1.headerLinks)
                    .where((0, drizzle_orm_1.eq)(schema_1.headerLinks.organization, userOrgId));
                const links = await _drizzle_1.db
                    .insert(schema_1.headerLinks)
                    .values(opt)
                    .returning();
                return links;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addCustomPages(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                // const update = await db
                //   .update(orgSocialMedia)
                //   .set({ twitter, linkedin, youtube, instagram })
                //   .where(eq(orgSocialMedia.organization, userOrgId))
                //   .returning();
                // return update[0];
                const page = await _drizzle_1.db
                    .insert(schema_1.customPages)
                    .values({
                    title: input.title,
                    slug: input.slug,
                    organization: userOrgId,
                    metaDescription: input.metaDescription,
                    metaTitle: input.metaTitle,
                })
                    .returning();
                return page;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.homePageResolvers = homePageResolvers;
