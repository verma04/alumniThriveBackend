"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniRequestRelations = exports.alumniRequest = exports.alumniConnectionRelations = exports.alumniConnection = exports.alumniKycRelations = exports.alumniKyc = exports.alumniToOrganizationRelations = exports.alumniToOrganization = exports.alumniResumeRelations = exports.aboutAlumniRelations = exports.alumniProfileRelations = exports.alumniResume = exports.aboutAlumni = exports.alumniProfile = exports.alumniRelations = exports.alumni = exports.loginTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const tenant_1 = require("../tenant");
const events_1 = require("./events");
const groups_1 = require("./groups");
const feed_1 = require("./feed");
const marketPlace_1 = require("./marketPlace");
exports.loginTypeEnum = (0, pg_core_1.pgEnum)('loginType', [
    'email',
    'google',
    'linkedin',
]);
exports.alumni = (0, pg_core_1.pgTable)('alumni', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    firstName: (0, pg_core_1.text)('firstName').notNull(),
    avatar: (0, pg_core_1.text)('avatar'),
    lastName: (0, pg_core_1.text)('lastName').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    loginType: (0, exports.loginTypeEnum)('loginType').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    googleId: (0, pg_core_1.text)('googleId'),
});
exports.alumniRelations = (0, drizzle_orm_1.relations)(exports.alumni, ({ one, many }) => ({
    profileInfo: one(exports.alumniProfile),
    aboutAlumni: one(exports.aboutAlumni),
    alumni: many(exports.alumniToOrganization),
    resume: many(exports.alumniToOrganization),
}));
exports.alumniProfile = (0, pg_core_1.pgTable)('alumniProfile', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    country: (0, pg_core_1.text)('country'),
    language: (0, pg_core_1.text)('designation'),
    DOB: (0, pg_core_1.text)('DOB'),
    alumniId: (0, pg_core_1.uuid)('alumni_ID').notNull(),
    experience: (0, pg_core_1.json)('experience'),
    education: (0, pg_core_1.json)('education'),
    phone: (0, pg_core_1.json)('phone'),
});
exports.aboutAlumni = (0, pg_core_1.pgTable)('aboutAlumni', {
    about: (0, pg_core_1.text)('about'),
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    currentPosition: (0, pg_core_1.text)('currentPosition'),
    linkedin: (0, pg_core_1.text)('linkedin'),
    instagram: (0, pg_core_1.text)('instagram'),
    portfolio: (0, pg_core_1.text)('portfolio'),
    alumniId: (0, pg_core_1.uuid)('alumni_ID').notNull(),
});
exports.alumniResume = (0, pg_core_1.pgTable)('alumniResume', {
    currentPosition: (0, pg_core_1.text)('currentPosition'),
    alumniId: (0, pg_core_1.uuid)('alumni_ID').notNull(),
});
exports.alumniProfileRelations = (0, drizzle_orm_1.relations)(exports.alumniProfile, ({ one }) => ({
    user: one(exports.alumni, {
        fields: [exports.alumniProfile.alumniId],
        references: [exports.alumni.id],
    }),
}));
exports.aboutAlumniRelations = (0, drizzle_orm_1.relations)(exports.aboutAlumni, ({ one }) => ({
    user: one(exports.alumni, {
        fields: [exports.aboutAlumni.alumniId],
        references: [exports.alumni.id],
    }),
}));
exports.alumniResumeRelations = (0, drizzle_orm_1.relations)(exports.alumniResume, ({ one }) => ({
    user: one(exports.alumni, {
        fields: [exports.alumniResume.alumniId],
        references: [exports.alumni.id],
    }),
}));
exports.alumniToOrganization = (0, pg_core_1.pgTable)('alumniOrganizationProfile', {
    alumniId: (0, pg_core_1.uuid)('alumni_id'),
    organizationId: (0, pg_core_1.uuid)('organization_id'),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull().default(false),
    isRequested: (0, pg_core_1.boolean)('isRequested').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.organizationId, table.alumniId] }),
        alumniToOrganization: (0, pg_core_1.primaryKey)({
            name: 'alumniOrganization',
            columns: [table.organizationId, table.alumniId],
        }),
    };
});
exports.alumniToOrganizationRelations = (0, drizzle_orm_1.relations)(exports.alumniToOrganization, ({ one, many }) => ({
    relations: many(feed_1.feedReactions),
    group: many(groups_1.groups),
    alumniKyc: one(exports.alumniKyc),
    events: many(events_1.events),
    groupMember: many(groups_1.groupMember),
    groupInvitation: many(groups_1.groupInvitation),
    groupRequest: many(groups_1.groupRequest),
    eventsAttendees: many(events_1.eventsAttendees),
    marketPlaceListing: many(marketPlace_1.marketPlace),
    followers: many(exports.alumniConnection, {
        relationName: 'followers',
    }),
    following: many(exports.alumniConnection, {
        relationName: 'following',
    }),
    requestSent: many(exports.alumniRequest, {
        relationName: 'requestSent',
    }),
    requestReceive: many(exports.alumniRequest, {
        relationName: 'requestReceive',
    }),
    alumni: one(exports.alumni, {
        fields: [exports.alumniToOrganization.alumniId],
        references: [exports.alumni.id],
    }),
    organization: one(tenant_1.organization, {
        fields: [exports.alumniToOrganization.alumniId],
        references: [tenant_1.organization.id],
    }),
}));
exports.alumniKyc = (0, pg_core_1.pgTable)('alumniKyc', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    affliction: (0, pg_core_1.json)('affliction'),
    referralSource: (0, pg_core_1.json)('referralSource'),
    comment: (0, pg_core_1.json)('comment').notNull(),
    agreement: (0, pg_core_1.boolean)('agreement').notNull(),
    orgId: (0, pg_core_1.uuid)('orgId').notNull(),
});
exports.alumniKycRelations = (0, drizzle_orm_1.relations)(exports.alumniKyc, ({ one, many }) => ({
    alumni: one(exports.alumniToOrganization, {
        fields: [exports.alumniKyc.orgId],
        references: [exports.alumniToOrganization.alumniId],
    }),
}));
exports.alumniConnection = (0, pg_core_1.pgTable)('alumniConnection', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    followingId: (0, pg_core_1.uuid)('alumni_id').notNull(),
    followerId: (0, pg_core_1.uuid)('followers_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    isAccepted: (0, pg_core_1.boolean)('isAccepted').notNull(),
}, (table) => {
    return {
        unq: (0, pg_core_1.unique)().on(table.followingId, table.followerId),
        unq2: (0, pg_core_1.unique)('alumniConnection').on(table.followingId, table.followerId),
    };
});
exports.alumniConnectionRelations = (0, drizzle_orm_1.relations)(exports.alumniConnection, ({ one, many }) => ({
    following: one(exports.alumniToOrganization, {
        fields: [exports.alumniConnection.followingId],
        references: [exports.alumniToOrganization.alumniId],
        relationName: 'following',
    }),
    followers: one(exports.alumniToOrganization, {
        fields: [exports.alumniConnection.followerId],
        references: [exports.alumniToOrganization.alumniId],
        relationName: 'followers',
    }),
}));
exports.alumniRequest = (0, pg_core_1.pgTable)('alumniConnectionRequest', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    senderId: (0, pg_core_1.uuid)('sender_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    isAccepted: (0, pg_core_1.boolean)('isAccepted').notNull(),
}, (table) => {
    return {
        unq: (0, pg_core_1.unique)().on(table.userId, table.senderId),
        unq2: (0, pg_core_1.unique)('alumniRequest').on(table.userId, table.senderId),
    };
});
exports.alumniRequestRelations = (0, drizzle_orm_1.relations)(exports.alumniRequest, ({ one, many }) => ({
    user: one(exports.alumniToOrganization, {
        fields: [exports.alumniRequest.userId],
        references: [exports.alumniToOrganization.alumniId],
        relationName: 'requestSent',
    }),
    sender: one(exports.alumniToOrganization, {
        fields: [exports.alumniRequest.senderId],
        references: [exports.alumniToOrganization.alumniId],
        relationName: 'requestReceive',
    }),
}));
