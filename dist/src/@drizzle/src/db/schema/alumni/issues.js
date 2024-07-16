"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueCommentRelations = exports.issueComment = exports.issuesRelations = exports.issues = exports.module = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const tenant_1 = require("../tenant");
const alumni_1 = require("./alumni");
const events_1 = require("./events");
exports.module = (0, pg_core_1.pgEnum)('module', ['event', 'communities', 'jobs']);
exports.issues = (0, pg_core_1.pgTable)('issue', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    visibility: (0, events_1.visibilityEnum)('visibility').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    summary: (0, pg_core_1.text)('summary'),
    page: (0, pg_core_1.text)('page'),
    details: (0, pg_core_1.text)('details'),
    module: (0, pg_core_1.text)('module'),
    feature: (0, pg_core_1.text)('feature'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
    user: (0, pg_core_1.uuid)('user_id').notNull(),
    ticket: (0, pg_core_1.integer)('ticket').notNull(),
    type: (0, pg_core_1.text)('type').notNull(),
    status: (0, pg_core_1.boolean)('status').notNull().default(false),
});
exports.issuesRelations = (0, drizzle_orm_1.relations)(exports.issues, ({ one, many }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.issues.organization],
        references: [tenant_1.organization.id],
    }),
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.issues.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    comment: many(exports.issueComment),
}));
exports.issueComment = (0, pg_core_1.pgTable)('issueComment', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    content: (0, pg_core_1.text)('content').notNull(),
    user: (0, pg_core_1.uuid)('user_id').notNull(),
    issue: (0, pg_core_1.uuid)('issue_id').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.issueCommentRelations = (0, drizzle_orm_1.relations)(exports.issueComment, ({ one, many }) => ({
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.issueComment.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    issue: one(exports.issues, {
        fields: [exports.issueComment.issue],
        references: [exports.issues.id],
    }),
}));
