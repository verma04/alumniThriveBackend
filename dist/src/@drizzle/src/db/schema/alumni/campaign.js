"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRelations = exports.campaign = exports.campaignGalleryRelations = exports.campaignGallery = exports.campaignAmountRecommendationRelations = exports.campaignAmountRecommendation = exports.campaignCategoryRelations = exports.campaignCategory = exports.campaignTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const alumni_1 = require("./alumni");
const tenant_1 = require("../tenant");
exports.campaignTypeEnum = (0, pg_core_1.pgEnum)('CampaignType', ['specific', 'open']);
exports.campaignCategory = (0, pg_core_1.pgTable)('campaignCategory', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
});
exports.campaignCategoryRelations = (0, drizzle_orm_1.relations)(exports.campaignCategory, ({ one, many }) => ({
    campaign: many(exports.campaign),
    organization: one(tenant_1.organization, {
        fields: [exports.campaignCategory.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.campaignAmountRecommendation = (0, pg_core_1.pgTable)('campaignAmountRecommendation', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    price: (0, pg_core_1.numeric)('price').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
});
exports.campaignAmountRecommendationRelations = (0, drizzle_orm_1.relations)(exports.campaignAmountRecommendation, ({ one, many }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.campaignAmountRecommendation.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.campaignGallery = (0, pg_core_1.pgTable)('fundCampaignGallery', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    url: (0, pg_core_1.text)('url').notNull(),
    campaign: (0, pg_core_1.text)('campaign_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.campaignGalleryRelations = (0, drizzle_orm_1.relations)(exports.campaignGallery, ({ one }) => ({
    campaign: one(exports.campaign, {
        fields: [exports.campaignGallery.id],
        references: [exports.campaign.id],
    }),
}));
exports.campaign = (0, pg_core_1.pgTable)('fundCampaign', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    user: (0, pg_core_1.uuid)('alumni_id').notNull(),
    category: (0, pg_core_1.uuid)('category').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    cover: (0, pg_core_1.text)('cover').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull(),
    shortDescription: (0, pg_core_1.text)('shortDescription').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    campaignType: (0, exports.campaignTypeEnum)('campaignType').notNull(),
    amount: (0, pg_core_1.numeric)('amount'),
    endDate: (0, pg_core_1.date)('endDate').notNull(),
});
exports.campaignRelations = (0, drizzle_orm_1.relations)(exports.campaign, ({ one, many }) => ({
    campaign: many(exports.campaignGallery),
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.campaign.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    category: one(exports.campaignCategory, {
        fields: [exports.campaign.category],
        references: [exports.campaignCategory.id],
    }),
    organization: one(tenant_1.organization, {
        fields: [exports.campaign.organization],
        references: [tenant_1.organization.id],
    }),
}));
