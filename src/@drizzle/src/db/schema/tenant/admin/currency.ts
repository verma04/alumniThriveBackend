import {
    pgTable,
    serial,
    text,
    integer,
    jsonb,
    uuid,
    timestamp,
    boolean,
    varchar,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { organization } from '../organizationSchema/organization'

export const currency = pgTable('currency', {
    id: uuid('id').defaultRandom().primaryKey(),
    cc: text('cc').notNull(),
    symbol: text('symbol').notNull(),
    name: text('name').notNull(),
})

export const currencyRelations = relations(currency, ({ one, many }) => ({
    organization: one(organization),
}))
