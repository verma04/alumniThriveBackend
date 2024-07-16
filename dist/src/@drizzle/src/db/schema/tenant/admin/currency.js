"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyRelations = exports.currency = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const organization_1 = require("../organizationSchema/organization");
exports.currency = (0, pg_core_1.pgTable)('currency', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    cc: (0, pg_core_1.text)('cc').notNull(),
    symbol: (0, pg_core_1.text)('symbol').notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
});
exports.currencyRelations = (0, drizzle_orm_1.relations)(exports.currency, ({ one, many }) => ({
    organization: one(organization_1.organization),
}));
