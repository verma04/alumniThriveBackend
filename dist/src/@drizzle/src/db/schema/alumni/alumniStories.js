"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniStoryRelations = exports.alumniStory = exports.alumniStoryCategoryRelations = exports.alumniStoryCategory = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const alumni_1 = require("./alumni");
const tenant_1 = require("../tenant");
exports.alumniStoryCategory = (0, pg_core_1.pgTable)('alumniStoryCategory', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
});
exports.alumniStoryCategoryRelations = (0, drizzle_orm_1.relations)(exports.alumniStoryCategory, ({ one, many }) => ({
    alumniStory: many(exports.alumniStory),
    organization: one(tenant_1.organization, {
        fields: [exports.alumniStoryCategory.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.alumniStory = (0, pg_core_1.pgTable)('alumniStory', {
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
});
exports.alumniStoryRelations = (0, drizzle_orm_1.relations)(exports.alumniStory, ({ one, many }) => ({
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.alumniStory.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    category: one(exports.alumniStoryCategory, {
        fields: [exports.alumniStory.category],
        references: [exports.alumniStoryCategory.id],
    }),
    organization: one(tenant_1.organization, {
        fields: [exports.alumniStory.organization],
        references: [tenant_1.organization.id],
    }),
}));
