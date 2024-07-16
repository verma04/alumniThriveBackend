"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationTagRelations = exports.organizationTag = exports.organizationSettingsRelations = exports.organizationSettings = exports.customDomainRelations = exports.customDomain = exports.customPagesRelations = exports.customPages = exports.headerLinksRelations = exports.headerLinks = exports.orgSocialMediaRelations = exports.orgSocialMedia = exports.stripeRelations = exports.stripe = exports.razorpayRelations = exports.razorpay = exports.themeRelations = exports.theme = exports.organizationRelations = exports.organization = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const domain_1 = require("../domain/domain");
const admin_1 = require("../admin");
const alumni_1 = require("../../alumni");
exports.organization = (0, pg_core_1.pgTable)('organization', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    address: (0, pg_core_1.text)('address').notNull(),
    category: (0, pg_core_1.text)('category').notNull(),
    organizationName: (0, pg_core_1.text)('organizationName').notNull(),
    timeZone: (0, pg_core_1.text)('timeZone').notNull(),
    logo: (0, pg_core_1.text)('logo').notNull(),
    website: (0, pg_core_1.text)('website').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    userId: (0, pg_core_1.uuid)('user_id'),
    favicon: (0, pg_core_1.text)('favicon'),
    color: (0, pg_core_1.text)('color'),
    currency: (0, pg_core_1.uuid)('currency_id'),
});
exports.organizationRelations = (0, drizzle_orm_1.relations)(exports.organization, ({ one, many }) => ({
    domain: one(domain_1.domain),
    razorpay: one(exports.razorpay),
    stripe: one(exports.stripe),
    group: many(alumni_1.groups),
    events: many(alumni_1.events),
    organization: many(alumni_1.alumniToOrganization),
    marketPlaceListing: many(alumni_1.marketPlace),
    marketPlaceListingCategory: many(alumni_1.marketPlaceCategory),
    theme: one(exports.theme),
    orgSocialMedia: one(exports.orgSocialMedia),
    groupSettings: one(exports.organizationSettings),
    user: one(admin_1.users, {
        fields: [exports.organization.userId],
        references: [admin_1.users.id],
    }),
    currency: one(admin_1.currency, {
        fields: [exports.organization.currency],
        references: [admin_1.currency.id],
    }),
    customDomain: one(exports.customDomain),
    tag: many(exports.organizationTag),
}));
exports.theme = (0, pg_core_1.pgTable)('theme', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    colorPrimary: (0, pg_core_1.text)('colorPrimary').notNull().default('#00b96b'),
    borderRadius: (0, pg_core_1.text)('borderRadius').notNull().default('2'),
    colorBgContainer: (0, pg_core_1.text)('colorBgContainer').notNull().default('#f6ffed'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organizationId: (0, pg_core_1.uuid)('organization_id'),
});
exports.themeRelations = (0, drizzle_orm_1.relations)(exports.theme, ({ one }) => ({
    user: one(exports.organization, {
        fields: [exports.theme.organizationId],
        references: [exports.organization.id],
    }),
}));
exports.razorpay = (0, pg_core_1.pgTable)('razorpay', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    keyID: (0, pg_core_1.text)('key_id').unique(),
    keySecret: (0, pg_core_1.text)('key_secret').unique(),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
    isEnabled: (0, pg_core_1.boolean)('isEnabled').default(false),
});
exports.razorpayRelations = (0, drizzle_orm_1.relations)(exports.razorpay, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.razorpay.organization],
        references: [exports.organization.id],
    }),
}));
exports.stripe = (0, pg_core_1.pgTable)('stripe ', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    keyID: (0, pg_core_1.text)('key_id').unique(),
    keySecret: (0, pg_core_1.text)('key_secret').unique(),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
    isEnabled: (0, pg_core_1.boolean)('isEnabled').default(false),
});
exports.stripeRelations = (0, drizzle_orm_1.relations)(exports.stripe, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.stripe.organization],
        references: [exports.organization.id],
    }),
}));
exports.orgSocialMedia = (0, pg_core_1.pgTable)('orgSocialMedia', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    twitter: (0, pg_core_1.text)('twitter'),
    linkedin: (0, pg_core_1.text)('linkedin'),
    instagram: (0, pg_core_1.text)('instagram'),
    youtube: (0, pg_core_1.text)('youtube'),
    organization: (0, pg_core_1.uuid)('organization_id'),
});
exports.orgSocialMediaRelations = (0, drizzle_orm_1.relations)(exports.orgSocialMedia, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.orgSocialMedia.organization],
        references: [exports.organization.id],
    }),
}));
exports.headerLinks = (0, pg_core_1.pgTable)('headerLinks', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    link: (0, pg_core_1.text)('link').notNull(),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
    sort: (0, pg_core_1.integer)('sort').notNull(),
    subMenu: (0, pg_core_1.json)('subMenu'),
});
exports.headerLinksRelations = (0, drizzle_orm_1.relations)(exports.headerLinks, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.headerLinks.organization],
        references: [exports.organization.id],
    }),
}));
exports.customPages = (0, pg_core_1.pgTable)('customPages', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull(),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
    metaDescription: (0, pg_core_1.text)('metaDescription').notNull(),
    metaTitle: (0, pg_core_1.text)('metaTitle').notNull(),
});
exports.customPagesRelations = (0, drizzle_orm_1.relations)(exports.customPages, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.customPages.organization],
        references: [exports.organization.id],
    }),
}));
exports.customDomain = (0, pg_core_1.pgTable)('customDomain', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    domain: (0, pg_core_1.text)('domain').notNull().unique(),
    dnsConfig: (0, pg_core_1.boolean)('dnsConfig').notNull().default(false),
    ssl: (0, pg_core_1.boolean)('ssl').notNull().default(false),
    status: (0, pg_core_1.boolean)('status').notNull().default(false),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
});
exports.customDomainRelations = (0, drizzle_orm_1.relations)(exports.customDomain, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.customDomain.organization],
        references: [exports.organization.id],
    }),
}));
exports.organizationSettings = (0, pg_core_1.pgTable)('organizationSettings', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    autoApproveGroup: (0, pg_core_1.boolean)('autoApproveGroup').default(false),
    autoApproveEvents: (0, pg_core_1.boolean)('autoApproveEvents').default(false),
    autoApproveJobs: (0, pg_core_1.boolean)('autoApproveJobs').default(false),
    autoApproveMarketPlace: (0, pg_core_1.boolean)('autoApproveMarketPlace').default(false),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
});
exports.organizationSettingsRelations = (0, drizzle_orm_1.relations)(exports.organizationSettings, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.organizationSettings.organization],
        references: [exports.organization.id],
    }),
}));
exports.organizationTag = (0, pg_core_1.pgTable)('organizationTag', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.organizationTagRelations = (0, drizzle_orm_1.relations)(exports.organizationTag, ({ one }) => ({
    organization: one(exports.organization, {
        fields: [exports.organizationTag.organization],
        references: [exports.organization.id],
    }),
}));
