"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleFaqsRelations = exports.moduleFaqs = exports.faqEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const tenant_1 = require("../tenant");
exports.faqEnum = (0, pg_core_1.pgEnum)('module', ['communities', 'events']);
exports.moduleFaqs = (0, pg_core_1.pgTable)('moduleFaqs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    faqModule: (0, exports.faqEnum)('faqModule').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('organizationId').notNull(),
    sort: (0, pg_core_1.integer)('sort').notNull().default(0),
});
exports.moduleFaqsRelations = (0, drizzle_orm_1.relations)(exports.moduleFaqs, ({ one, many }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.moduleFaqs.organization],
        references: [tenant_1.organization.id],
    }),
}));
