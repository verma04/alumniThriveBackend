import { relations, sql } from 'drizzle-orm'

import {
    boolean,
    integer,
    numeric,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core'
import { organization } from '../tenant'
import { alumni, alumniToOrganization } from './alumni'
import { visibilityEnum } from './events'
import { feedComment } from './feed'

export const module = pgEnum('module', ['event', 'communities', 'jobs'])

export const issues = pgTable('issue', {
    id: uuid('id').defaultRandom().primaryKey(),
    visibility: visibilityEnum('visibility').notNull(),
    title: text('title').notNull(),
    summary: text('summary'),
    page: text('page'),
    details: text('details'),
    module: text('module'),
    feature: text('feature'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    organization: uuid('organization_id').notNull(),
    user: uuid('user_id').notNull(),
    ticket: integer('ticket').notNull(),
    type: text('type').notNull(),
    status: boolean('status').notNull().default(false),
})

export const issuesRelations = relations(issues, ({ one, many }) => ({
    organization: one(organization, {
        fields: [issues.organization],
        references: [organization.id],
    }),
    user: one(alumniToOrganization, {
        fields: [issues.user],
        references: [alumniToOrganization.alumniId],
    }),
    comment: many(issueComment),
}))

export const issueComment = pgTable('issueComment', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    user: uuid('user_id').notNull(),
    issue: uuid('issue_id').notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').defaultNow(),
})

export const issueCommentRelations = relations(
    issueComment,
    ({ one, many }) => ({
        user: one(alumniToOrganization, {
            fields: [issueComment.user],
            references: [alumniToOrganization.alumniId],
        }),
        issue: one(issues, {
            fields: [issueComment.issue],
            references: [issues.id],
        }),
    })
)
