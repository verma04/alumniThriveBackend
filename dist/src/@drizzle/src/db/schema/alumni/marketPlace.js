"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketPlaceImagesRelation = exports.marketPlaceImages = exports.marketPlaceCategoryRelations = exports.marketPlaceCategory = exports.marketPlaceRelations = exports.marketPlace = exports.conditionEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const alumni_1 = require("./alumni");
const tenant_1 = require("../tenant");
const chat_1 = require("./chat");
exports.conditionEnum = (0, pg_core_1.pgEnum)('conditionEnum', [
    'new',
    'used-like now',
    'used-like good',
    'used-like fair',
]);
exports.marketPlace = (0, pg_core_1.pgTable)('marketPlaceListing', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    postedBy: (0, pg_core_1.uuid)('postedBy_id').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    price: (0, pg_core_1.text)('price').notNull(),
    condition: (0, exports.conditionEnum)('condition').notNull(),
    sku: (0, pg_core_1.text)('sku'),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    description: (0, pg_core_1.text)('description').notNull(),
    location: (0, pg_core_1.text)('location').notNull(),
    // expireDate: date("expireDate"),
    category: (0, pg_core_1.uuid)('category_id'),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull().default(false),
    isActive: (0, pg_core_1.boolean)('isActive').notNull().default(false),
    isExpired: (0, pg_core_1.boolean)('isExpired').notNull().default(false),
    // group: uuid("groupId"),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    tag: (0, pg_core_1.json)('tag'),
    currency: (0, pg_core_1.text)('currency').notNull(),
});
exports.marketPlaceRelations = (0, drizzle_orm_1.relations)(exports.marketPlace, ({ one, many }) => ({
    // group: one(groups, {
    //   fields: [marketPlace.id],
    //   references: [groups.id],
    // }),
    images: many(exports.marketPlaceImages),
    organization: one(tenant_1.organization, {
        fields: [exports.marketPlace.organization],
        references: [tenant_1.organization.id],
    }),
    postedBy: one(alumni_1.alumniToOrganization, {
        fields: [exports.marketPlace.postedBy],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    category: one(exports.marketPlaceCategory, {
        fields: [exports.marketPlace.category],
        references: [exports.marketPlaceCategory.id],
    }),
    messages: many(chat_1.messages),
}));
exports.marketPlaceCategory = (0, pg_core_1.pgTable)('marketPlaceCategory', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.marketPlaceCategoryRelations = (0, drizzle_orm_1.relations)(exports.marketPlaceCategory, ({ one, many }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.marketPlaceCategory.organization],
        references: [tenant_1.organization.id],
    }),
    marketPlace: many(exports.marketPlace),
}));
exports.marketPlaceImages = (0, pg_core_1.pgTable)('marketPlaceImages', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    url: (0, pg_core_1.text)('url').notNull(),
    marketPlace: (0, pg_core_1.uuid)('marketPlace_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.marketPlaceImagesRelation = (0, drizzle_orm_1.relations)(exports.marketPlaceImages, ({ one, many }) => ({
    marketPlace: one(exports.marketPlace, {
        fields: [exports.marketPlaceImages.marketPlace],
        references: [exports.marketPlace.id],
    }),
}));
