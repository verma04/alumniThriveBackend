"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainRelations = exports.domain = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const organization_1 = require("../organizationSchema/organization");
exports.domain = (0, pg_core_1.pgTable)('domain', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    domain: (0, pg_core_1.text)('domain').notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organizationId: (0, pg_core_1.uuid)('organization_id'),
});
exports.domainRelations = (0, drizzle_orm_1.relations)(exports.domain, ({ one }) => ({
    author: one(organization_1.organization, {
        fields: [exports.domain.organizationId],
        references: [organization_1.organization.id],
    }),
}));
