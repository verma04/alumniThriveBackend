"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendingConditionsGroupsRelations = exports.trendingConditionsGroups = exports.organizationGroupSettingsRelations = exports.organizationSettingsGroups = exports.groupViewsRelations = exports.groupViews = exports.groupRequestRelations = exports.groupRequest = exports.invitationRelations = exports.groupInvitation = exports.groupsSettingRelations = exports.groupsSetting = exports.groupToUserRelations = exports.groupMember = exports.groupViewRelations = exports.groupView = exports.groupRelations = exports.groups = exports.groupInterestsRelations = exports.groupInterests = exports.groupThemeRelations = exports.groupTheme = exports.joiningConditionEnum = exports.userAddedForm = exports.managerRole = exports.groupTypeEnum = exports.privacyEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const alumni_1 = require("./alumni");
const tenant_1 = require("../tenant");
const events_1 = require("./events");
exports.privacyEnum = (0, pg_core_1.pgEnum)('privacy', ['private', 'public']);
exports.groupTypeEnum = (0, pg_core_1.pgEnum)('groupType', [
    'virtual',
    'hybrid',
    'inPerson',
]);
exports.managerRole = (0, pg_core_1.pgEnum)('managerRole', ['admin', 'manager', 'user']);
exports.userAddedForm = (0, pg_core_1.pgEnum)('userAddedForm', ['invite', 'direct']);
exports.joiningConditionEnum = (0, pg_core_1.pgEnum)('joiningCondition', [
    'Anyone Can Join',
    'Admin only Add',
]);
exports.groupTheme = (0, pg_core_1.pgTable)('groupTheme', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
});
exports.groupThemeRelations = (0, drizzle_orm_1.relations)(exports.groupTheme, ({ one, many }) => ({
    groups: many(exports.groups),
    organization: one(tenant_1.organization, {
        fields: [exports.groupTheme.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.groupInterests = (0, pg_core_1.pgTable)('groupInterests', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
});
exports.groupInterestsRelations = (0, drizzle_orm_1.relations)(exports.groupInterests, ({ one, many }) => ({
    groups: many(exports.groups),
    organization: one(tenant_1.organization, {
        fields: [exports.groupInterests.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.groups = (0, pg_core_1.pgTable)('groups', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    slug: (0, pg_core_1.text)('slug').unique().notNull(),
    title: (0, pg_core_1.text)('title'),
    creator: (0, pg_core_1.uuid)('creator_id'),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    cover: (0, pg_core_1.text)('cover').default('/groups-default-cover-photo.jpg'),
    avatar: (0, pg_core_1.text)('avatar').default('/groups-default-cover-photo.jpg'),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull().default(false),
    isBlocked: (0, pg_core_1.boolean)('isBlocked').notNull().default(false),
    isPaused: (0, pg_core_1.boolean)('isPaused').notNull().default(false),
    isRejected: (0, pg_core_1.boolean)('isRejected').notNull().default(false),
    isActive: (0, pg_core_1.boolean)('isActive').notNull().default(false),
    about: (0, pg_core_1.text)('about'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    isFeatured: (0, pg_core_1.boolean)('isFeatured').notNull().default(false),
    theme: (0, pg_core_1.uuid)('theme'),
    interest: (0, pg_core_1.uuid)('interests'),
    numberOfUser: (0, pg_core_1.integer)('numberOfUser').default(0),
    numberOfLikes: (0, pg_core_1.integer)('numberOfLikes').default(0),
    numberOfPost: (0, pg_core_1.integer)('numberOfPost').default(0),
    numberOfViews: (0, pg_core_1.integer)('numberOfViews').default(0),
    tag: (0, pg_core_1.text)('tag').array(),
});
exports.groupRelations = (0, drizzle_orm_1.relations)(exports.groups, ({ one, many }) => ({
    setting: one(exports.groupsSetting),
    member: many(exports.groupMember),
    events: many(events_1.events),
    invitation: many(exports.groupInvitation),
    request: many(exports.groupRequest),
    creator: one(alumni_1.alumniToOrganization, {
        fields: [exports.groups.creator],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    organization: one(tenant_1.organization, {
        fields: [exports.groups.organization],
        references: [tenant_1.organization.id],
    }),
    theme: one(exports.groupTheme, {
        fields: [exports.groups.theme],
        references: [exports.groupTheme.id],
    }),
    interest: one(exports.groupInterests, {
        fields: [exports.groups.interest],
        references: [exports.groupInterests.id],
    }),
    views: many(exports.groupView),
}));
exports.groupView = (0, pg_core_1.pgTable)('groupViews', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    group: (0, pg_core_1.uuid)('group_id').notNull(),
});
exports.groupViewRelations = (0, drizzle_orm_1.relations)(exports.groupView, ({ one, many }) => ({
    group: one(exports.groups, {
        fields: [exports.groupView.group],
        references: [exports.groups.id],
    }),
}));
exports.groupMember = (0, pg_core_1.pgTable)('users_to_groups', {
    alumniId: (0, pg_core_1.uuid)('alumni_id').notNull(),
    groupId: (0, pg_core_1.uuid)('group_id').notNull(),
    role: (0, exports.managerRole)('managerRole').default('user'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    userAddedForm: (0, exports.userAddedForm)('userAddedForm'),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.alumniId, table.groupId] }),
        alumniToOrganization: (0, pg_core_1.primaryKey)({
            name: 'alumniOrganization',
            columns: [table.alumniId, table.groupId],
        }),
    };
});
exports.groupToUserRelations = (0, drizzle_orm_1.relations)(exports.groupMember, ({ one, many }) => ({
    groupId: one(exports.groups, {
        fields: [exports.groupMember.groupId],
        references: [exports.groups.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.groupMember.alumniId],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
exports.groupsSetting = (0, pg_core_1.pgTable)('groupsSetting', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    groupId: (0, pg_core_1.uuid)('group_id').notNull(),
    groupType: (0, exports.groupTypeEnum)('groupType').notNull().default('virtual'),
    joiningCondition: (0, exports.joiningConditionEnum)('joiningCondition').default('Anyone Can Join'),
    privacy: (0, exports.privacyEnum)('privacy').default('public'),
});
exports.groupsSettingRelations = (0, drizzle_orm_1.relations)(exports.groupsSetting, ({ one }) => ({
    alumni: one(exports.groups, {
        fields: [exports.groupsSetting.groupId],
        references: [exports.groups.id],
    }),
}));
exports.groupInvitation = (0, pg_core_1.pgTable)('groupInvitation', {
    alumniId: (0, pg_core_1.uuid)('alumni_id').notNull(),
    groupId: (0, pg_core_1.uuid)('group_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    isAccepted: (0, pg_core_1.boolean)('isAccepted').default(false),
    actionTime: (0, pg_core_1.timestamp)('actionTime'),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.alumniId, table.groupId] }),
        alumniToOrganization: (0, pg_core_1.primaryKey)({
            name: 'alumniOrganization',
            columns: [table.alumniId, table.groupId],
        }),
    };
});
exports.invitationRelations = (0, drizzle_orm_1.relations)(exports.groupInvitation, ({ one, many }) => ({
    groupId: one(exports.groups, {
        fields: [exports.groupInvitation.groupId],
        references: [exports.groups.id],
    }),
    alumniId: one(alumni_1.alumniToOrganization, {
        fields: [exports.groupInvitation.alumniId],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
exports.groupRequest = (0, pg_core_1.pgTable)('groupRequest', {
    alumniId: (0, pg_core_1.uuid)('alumni_id').notNull(),
    groupId: (0, pg_core_1.uuid)('group_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    isAccepted: (0, pg_core_1.boolean)('isAccepted').default(false),
    // acceptedBy: uuid("acceptedBy"),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.alumniId, table.groupId] }),
        alumniToOrganization: (0, pg_core_1.primaryKey)({
            name: 'groupRequest',
            columns: [table.alumniId, table.groupId],
        }),
    };
});
exports.groupRequestRelations = (0, drizzle_orm_1.relations)(exports.groupRequest, ({ one, many }) => ({
    groupId: one(exports.groups, {
        fields: [exports.groupRequest.groupId],
        references: [exports.groups.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.groupRequest.alumniId],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    // acceptedBy: one(alumniToOrganization, {
    //   fields: [groupRequest.acceptedBy],
    //   references: [alumniToOrganization.alumniId],
    // }),
}));
exports.groupViews = (0, pg_core_1.pgTable)('groupsViews', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    group: (0, pg_core_1.uuid)('group_id').notNull(),
    user: (0, pg_core_1.uuid)('user_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.groupViewsRelations = (0, drizzle_orm_1.relations)(exports.groupViews, ({ one }) => ({
    group: one(exports.groups, {
        fields: [exports.groupViews.group],
        references: [exports.groups.id],
    }),
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.groupViews.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
exports.organizationSettingsGroups = (0, pg_core_1.pgTable)('organizationSettingsGroups', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    autoApprove: (0, pg_core_1.boolean)('autoApprove').default(false),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
});
exports.organizationGroupSettingsRelations = (0, drizzle_orm_1.relations)(exports.organizationSettingsGroups, ({ one }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.organizationSettingsGroups.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.trendingConditionsGroups = (0, pg_core_1.pgTable)('trendingConditionsGroups', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    views: (0, pg_core_1.boolean)('views').default(true),
    discussion: (0, pg_core_1.boolean)('discussion').default(true),
    user: (0, pg_core_1.boolean)('user').default(true),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
});
exports.trendingConditionsGroupsRelations = (0, drizzle_orm_1.relations)(exports.trendingConditionsGroups, ({ one }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.trendingConditionsGroups.organization],
        references: [tenant_1.organization.id],
    }),
}));
