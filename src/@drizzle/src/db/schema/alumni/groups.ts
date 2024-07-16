import {
    pgTable,
    serial,
    text,
    integer,
    boolean,
    primaryKey,
    uuid,
    pgEnum,
    timestamp,
    numeric,
    json,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { alumni, alumniToOrganization } from './alumni'
import { organization } from '../tenant'
import { alumniFeed } from './feed'
import { events } from './events'

export const privacyEnum = pgEnum('privacy', ['private', 'public'])

export const groupTypeEnum = pgEnum('groupType', [
    'virtual',
    'hybrid',
    'inPerson',
])

export const managerRole = pgEnum('managerRole', ['admin', 'manager', 'user'])
export const userAddedForm = pgEnum('userAddedForm', ['invite', 'direct'])
export const joiningConditionEnum = pgEnum('joiningCondition', [
    'Anyone Can Join',
    'Admin only Add',
])

export const groupTheme = pgTable('groupTheme', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    organization: uuid('org_id').notNull(),
})

export const groupThemeRelations = relations(groupTheme, ({ one, many }) => ({
    groups: many(groups),
    organization: one(organization, {
        fields: [groupTheme.organization],
        references: [organization.id],
    }),
}))
export const groupInterests = pgTable('groupInterests', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    organization: uuid('org_id').notNull(),
})

export const groupInterestsRelations = relations(
    groupInterests,
    ({ one, many }) => ({
        groups: many(groups),
        organization: one(organization, {
            fields: [groupInterests.organization],
            references: [organization.id],
        }),
    })
)

export const groups = pgTable('groups', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').unique().notNull(),
    title: text('title'),
    creator: uuid('creator_id'),
    organization: uuid('org_id').notNull(),
    cover: text('cover').default('/groups-default-cover-photo.jpg'),
    avatar: text('avatar').default('/groups-default-cover-photo.jpg'),
    isApproved: boolean('isApproved').notNull().default(false),
    isBlocked: boolean('isBlocked').notNull().default(false),
    isPaused: boolean('isPaused').notNull().default(false),
    isRejected: boolean('isRejected').notNull().default(false),
    isActive: boolean('isActive').notNull().default(false),
    about: text('about'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    isFeatured: boolean('isFeatured').notNull().default(false),
    theme: uuid('theme'),
    interest: uuid('interests'),
    numberOfUser: integer('numberOfUser').default(0),
    numberOfLikes: integer('numberOfLikes').default(0),
    numberOfPost: integer('numberOfPost').default(0),
    numberOfViews: integer('numberOfViews').default(0),
    tag: text('tag').array(),
})

export const groupRelations = relations(groups, ({ one, many }) => ({
    setting: one(groupsSetting),
    member: many(groupMember),
    events: many(events),
    invitation: many(groupInvitation),
    request: many(groupRequest),
    creator: one(alumniToOrganization, {
        fields: [groups.creator],
        references: [alumniToOrganization.alumniId],
    }),
    organization: one(organization, {
        fields: [groups.organization],
        references: [organization.id],
    }),
    theme: one(groupTheme, {
        fields: [groups.theme],
        references: [groupTheme.id],
    }),
    interest: one(groupInterests, {
        fields: [groups.interest],
        references: [groupInterests.id],
    }),
    views: many(groupView),
}))

export const groupView = pgTable('groupViews', {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    group: uuid('group_id').notNull(),
})

export const groupViewRelations = relations(groupView, ({ one, many }) => ({
    group: one(groups, {
        fields: [groupView.group],
        references: [groups.id],
    }),
}))

export const groupMember = pgTable(
    'users_to_groups',
    {
        alumniId: uuid('alumni_id').notNull(),
        groupId: uuid('group_id').notNull(),
        role: managerRole('managerRole').default('user'),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
        userAddedForm: userAddedForm('userAddedForm'),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.alumniId, table.groupId] }),
            alumniToOrganization: primaryKey({
                name: 'alumniOrganization',
                columns: [table.alumniId, table.groupId],
            }),
        }
    }
)

export const groupToUserRelations = relations(groupMember, ({ one, many }) => ({
    groupId: one(groups, {
        fields: [groupMember.groupId],
        references: [groups.id],
    }),
    alumni: one(alumniToOrganization, {
        fields: [groupMember.alumniId],
        references: [alumniToOrganization.alumniId],
    }),
}))

export const groupsSetting = pgTable('groupsSetting', {
    id: uuid('id').defaultRandom().primaryKey(),
    groupId: uuid('group_id').notNull(),
    groupType: groupTypeEnum('groupType').notNull().default('virtual'),
    joiningCondition:
        joiningConditionEnum('joiningCondition').default('Anyone Can Join'),
    privacy: privacyEnum('privacy').default('public'),
})

export const groupsSettingRelations = relations(groupsSetting, ({ one }) => ({
    alumni: one(groups, {
        fields: [groupsSetting.groupId],
        references: [groups.id],
    }),
}))

export const groupInvitation = pgTable(
    'groupInvitation',
    {
        alumniId: uuid('alumni_id').notNull(),
        groupId: uuid('group_id').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
        isAccepted: boolean('isAccepted').default(false),
        actionTime: timestamp('actionTime'),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.alumniId, table.groupId] }),
            alumniToOrganization: primaryKey({
                name: 'alumniOrganization',
                columns: [table.alumniId, table.groupId],
            }),
        }
    }
)

export const invitationRelations = relations(
    groupInvitation,
    ({ one, many }) => ({
        groupId: one(groups, {
            fields: [groupInvitation.groupId],
            references: [groups.id],
        }),
        alumniId: one(alumniToOrganization, {
            fields: [groupInvitation.alumniId],
            references: [alumniToOrganization.alumniId],
        }),
    })
)

export const groupRequest = pgTable(
    'groupRequest',
    {
        alumniId: uuid('alumni_id').notNull(),
        groupId: uuid('group_id').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
        isAccepted: boolean('isAccepted').default(false),
        // acceptedBy: uuid("acceptedBy"),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.alumniId, table.groupId] }),
            alumniToOrganization: primaryKey({
                name: 'groupRequest',
                columns: [table.alumniId, table.groupId],
            }),
        }
    }
)

export const groupRequestRelations = relations(
    groupRequest,
    ({ one, many }) => ({
        groupId: one(groups, {
            fields: [groupRequest.groupId],
            references: [groups.id],
        }),
        alumni: one(alumniToOrganization, {
            fields: [groupRequest.alumniId],
            references: [alumniToOrganization.alumniId],
        }),
        // acceptedBy: one(alumniToOrganization, {
        //   fields: [groupRequest.acceptedBy],
        //   references: [alumniToOrganization.alumniId],
        // }),
    })
)

export const groupViews = pgTable('groupsViews', {
    id: uuid('id').defaultRandom().primaryKey(),
    group: uuid('group_id').notNull(),
    user: uuid('user_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})

export const groupViewsRelations = relations(groupViews, ({ one }) => ({
    group: one(groups, {
        fields: [groupViews.group],
        references: [groups.id],
    }),
    user: one(alumniToOrganization, {
        fields: [groupViews.user],
        references: [alumniToOrganization.alumniId],
    }),
}))

export const organizationSettingsGroups = pgTable(
    'organizationSettingsGroups',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        autoApprove: boolean('autoApprove').default(false),
        organization: uuid('organization_id').notNull(),
    }
)

export const organizationGroupSettingsRelations = relations(
    organizationSettingsGroups,
    ({ one }) => ({
        organization: one(organization, {
            fields: [organizationSettingsGroups.organization],
            references: [organization.id],
        }),
    })
)

export const trendingConditionsGroups = pgTable('trendingConditionsGroups', {
    id: uuid('id').defaultRandom().primaryKey(),
    views: boolean('views').default(true),
    discussion: boolean('discussion').default(true),
    user: boolean('user').default(true),
    organization: uuid('organization_id').notNull(),
})

export const trendingConditionsGroupsRelations = relations(
    trendingConditionsGroups,
    ({ one }) => ({
        organization: one(organization, {
            fields: [trendingConditionsGroups.organization],
            references: [organization.id],
        }),
    })
)
