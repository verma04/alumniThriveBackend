import { relations, sql } from 'drizzle-orm'
import {
    boolean,
    integer,
    json,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core'
import { domain } from '../domain/domain'
import { currency, users } from '../admin'
import {
    alumniToOrganization,
    events,
    groups,
    marketPlace,
    marketPlaceCategory,
} from '../../alumni'

export const organization = pgTable('organization', {
    id: uuid('id').defaultRandom().primaryKey(),
    address: text('address').notNull(),
    category: text('category').notNull(),
    organizationName: text('organizationName').notNull(),
    timeZone: text('timeZone').notNull(),
    logo: text('logo').notNull(),
    website: text('website').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    userId: uuid('user_id'),
    favicon: text('favicon'),
    color: text('color'),
    currency: uuid('currency_id'),
})

export const organizationRelations = relations(
    organization,
    ({ one, many }) => ({
        domain: one(domain),
        razorpay: one(razorpay),
        stripe: one(stripe),
        group: many(groups),
        events: many(events),
        organization: many(alumniToOrganization),
        marketPlaceListing: many(marketPlace),
        marketPlaceListingCategory: many(marketPlaceCategory),
        theme: one(theme),
        orgSocialMedia: one(orgSocialMedia),
        groupSettings: one(organizationSettings),
        user: one(users, {
            fields: [organization.userId],
            references: [users.id],
        }),
        currency: one(currency, {
            fields: [organization.currency],
            references: [currency.id],
        }),
        customDomain: one(customDomain),
        tag: many(organizationTag),
    })
)

export const theme = pgTable('theme', {
    id: uuid('id').defaultRandom().primaryKey(),
    colorPrimary: text('colorPrimary').notNull().default('#00b96b'),
    borderRadius: text('borderRadius').notNull().default('2'),
    colorBgContainer: text('colorBgContainer').notNull().default('#f6ffed'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    organizationId: uuid('organization_id'),
})

export const themeRelations = relations(theme, ({ one }) => ({
    user: one(organization, {
        fields: [theme.organizationId],
        references: [organization.id],
    }),
}))

export const razorpay = pgTable('razorpay', {
    id: uuid('id').defaultRandom().primaryKey(),
    keyID: text('key_id').unique(),
    keySecret: text('key_secret').unique(),
    organization: uuid('organization_id').notNull(),
    isEnabled: boolean('isEnabled').default(false),
})

export const razorpayRelations = relations(razorpay, ({ one }) => ({
    organization: one(organization, {
        fields: [razorpay.organization],
        references: [organization.id],
    }),
}))

export const stripe = pgTable('stripe ', {
    id: uuid('id').defaultRandom().primaryKey(),
    keyID: text('key_id').unique(),
    keySecret: text('key_secret').unique(),
    organization: uuid('organization_id').notNull(),
    isEnabled: boolean('isEnabled').default(false),
})

export const stripeRelations = relations(stripe, ({ one }) => ({
    organization: one(organization, {
        fields: [stripe.organization],
        references: [organization.id],
    }),
}))

export const orgSocialMedia = pgTable('orgSocialMedia', {
    id: uuid('id').defaultRandom().primaryKey(),
    twitter: text('twitter'),
    linkedin: text('linkedin'),
    instagram: text('instagram'),
    youtube: text('youtube'),
    organization: uuid('organization_id'),
})

export const orgSocialMediaRelations = relations(orgSocialMedia, ({ one }) => ({
    organization: one(organization, {
        fields: [orgSocialMedia.organization],
        references: [organization.id],
    }),
}))

export const headerLinks = pgTable('headerLinks', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    link: text('link').notNull(),
    organization: uuid('organization_id').notNull(),
    sort: integer('sort').notNull(),
    subMenu: json('subMenu'),
})

export const headerLinksRelations = relations(headerLinks, ({ one }) => ({
    organization: one(organization, {
        fields: [headerLinks.organization],
        references: [organization.id],
    }),
}))

export const customPages = pgTable('customPages', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    organization: uuid('organization_id').notNull(),
    metaDescription: text('metaDescription').notNull(),
    metaTitle: text('metaTitle').notNull(),
})

export const customPagesRelations = relations(customPages, ({ one }) => ({
    organization: one(organization, {
        fields: [customPages.organization],
        references: [organization.id],
    }),
}))

export const customDomain = pgTable('customDomain', {
    id: uuid('id').defaultRandom().primaryKey(),
    domain: text('domain').notNull().unique(),
    dnsConfig: boolean('dnsConfig').notNull().default(false),
    ssl: boolean('ssl').notNull().default(false),
    status: boolean('status').notNull().default(false),
    organization: uuid('organization_id').notNull(),
})

export const customDomainRelations = relations(customDomain, ({ one }) => ({
    organization: one(organization, {
        fields: [customDomain.organization],
        references: [organization.id],
    }),
}))

export const organizationSettings = pgTable('organizationSettings', {
    id: uuid('id').defaultRandom().primaryKey(),

    autoApproveGroup: boolean('autoApproveGroup').default(false),
    autoApproveEvents: boolean('autoApproveEvents').default(false),
    autoApproveJobs: boolean('autoApproveJobs').default(false),
    autoApproveMarketPlace: boolean('autoApproveMarketPlace').default(false),
    organization: uuid('organization_id').notNull(),
})

export const organizationSettingsRelations = relations(
    organizationSettings,
    ({ one }) => ({
        organization: one(organization, {
            fields: [organizationSettings.organization],
            references: [organization.id],
        }),
    })
)

export const organizationTag = pgTable('organizationTag', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    organization: uuid('organization_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const organizationTagRelations = relations(
    organizationTag,
    ({ one }) => ({
        organization: one(organization, {
            fields: [organizationTag.organization],
            references: [organization.id],
        }),
    })
)
