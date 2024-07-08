import { relations, sql } from 'drizzle-orm'
import {
    pgTable,
    text,
    uuid,
    timestamp,
    pgEnum,
    numeric,
    integer,
} from 'drizzle-orm/pg-core'
import { organization } from '../tenant'

export const faqEnum = pgEnum('module', ['communities', 'events'])
export const moduleFaqs = pgTable('moduleFaqs', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    faqModule: faqEnum('faqModule').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    organization: uuid('organizationId').notNull(),
    sort: integer('sort').notNull().default(0),
})
export const moduleFaqsRelations = relations(moduleFaqs, ({ one, many }) => ({
    organization: one(organization, {
        fields: [moduleFaqs.organization],
        references: [organization.id],
    }),
}))
