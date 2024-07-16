"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedCommentRelations = exports.feedComment = exports.mediaRelations = exports.media = exports.feedReactionsRelations = exports.feedReactions = exports.reactionsType = exports.feedRelations = exports.alumniFeed = exports.feedForm = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const groups_1 = require("./groups");
const alumni_1 = require("./alumni");
const tenant_1 = require("../tenant");
const jobs_1 = require("./jobs");
const marketPlace_1 = require("./marketPlace");
exports.feedForm = (0, pg_core_1.pgEnum)('feedForm', [
    'group',
    'events',
    'jobs',
    'marketPlace',
]);
exports.alumniFeed = (0, pg_core_1.pgTable)('alumniFeed', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    alumniId: (0, pg_core_1.uuid)('alumni_id').notNull(),
    groupId: (0, pg_core_1.uuid)('group_id'),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    feedForm: (0, exports.feedForm)('feedForm').notNull(),
    eventId: (0, pg_core_1.uuid)('event_id'),
    jobs: (0, pg_core_1.uuid)('jobs_id'),
    marketPlace: (0, pg_core_1.uuid)('marketPlace_id'),
});
exports.feedRelations = (0, drizzle_orm_1.relations)(exports.alumniFeed, ({ one, many }) => ({
    reactions: many(exports.feedReactions),
    comment: many(exports.feedComment),
    media: many(exports.media),
    group: one(groups_1.groups, {
        fields: [exports.alumniFeed.groupId],
        references: [groups_1.groups.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.alumniFeed.alumniId],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    organization: one(tenant_1.organization, {
        fields: [exports.alumniFeed.organization],
        references: [tenant_1.organization.id],
    }),
    job: one(jobs_1.jobs, {
        fields: [exports.alumniFeed.jobs],
        references: [jobs_1.jobs.id],
    }),
    marketPlace: one(marketPlace_1.marketPlace, {
        fields: [exports.alumniFeed.marketPlace],
        references: [marketPlace_1.marketPlace.id],
    }),
}));
exports.reactionsType = (0, pg_core_1.pgEnum)('reactionsType', [
    'like',
    'celebrate',
    'support',
    'love',
    'insightful',
    'funny',
]);
exports.feedReactions = (0, pg_core_1.pgTable)('feedReactions', {
    alumniId: (0, pg_core_1.uuid)('alumni_id').notNull(),
    feedId: (0, pg_core_1.uuid)('feed_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    reactionsType: (0, exports.reactionsType)('reactionsType').notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.alumniId, table.feedId] }),
        alumniToOrganization: (0, pg_core_1.primaryKey)({
            name: 'alumniOrganization',
            columns: [table.alumniId, table.feedId],
        }),
    };
});
exports.feedReactionsRelations = (0, drizzle_orm_1.relations)(exports.feedReactions, ({ one, many }) => ({
    feed: one(exports.alumniFeed, {
        fields: [exports.feedReactions.feedId],
        references: [exports.alumniFeed.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.feedReactions.alumniId],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
exports.media = (0, pg_core_1.pgTable)('media', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    feedId: (0, pg_core_1.uuid)('feed_id'),
    meta: (0, pg_core_1.json)('meta'),
    url: (0, pg_core_1.text)('url').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    alumni: (0, pg_core_1.uuid)('alumni_id').notNull(),
    groupId: (0, pg_core_1.uuid)('group_Id'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.mediaRelations = (0, drizzle_orm_1.relations)(exports.media, ({ one, many }) => ({
    feed: one(exports.alumniFeed, {
        fields: [exports.media.feedId],
        references: [exports.alumniFeed.id],
    }),
    group: one(groups_1.groups, {
        fields: [exports.media.groupId],
        references: [groups_1.groups.id],
    }),
    organization: one(tenant_1.organization, {
        fields: [exports.media.organization],
        references: [tenant_1.organization.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.media.alumni],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
exports.feedComment = (0, pg_core_1.pgTable)('feedComments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    content: (0, pg_core_1.text)('content').notNull(),
    user: (0, pg_core_1.uuid)('user_id').notNull(),
    feed: (0, pg_core_1.uuid)('feed_id').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.feedCommentRelations = (0, drizzle_orm_1.relations)(exports.feedComment, ({ one, many }) => ({
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.feedComment.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    feed: one(exports.alumniFeed, {
        fields: [exports.feedComment.feed],
        references: [exports.alumniFeed.id],
    }),
}));
