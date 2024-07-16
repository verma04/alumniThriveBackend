"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsAttendeesRelations = exports.eventsAttendees = exports.eventsSettingsRelations = exports.eventsSettings = exports.eventSponsorsRelations = exports.eventSponsors = exports.eventHostRelations = exports.eventHost = exports.eventsOrganizerRelations = exports.eventsOrganizer = exports.eventsSponsorShipRelations = exports.eventsSponsorShip = exports.eventsRelations = exports.eventsAgendaRelations = exports.eventsAgenda = exports.eventsSpeakerToAgendaRelations = exports.eventsSpeakerToAgenda = exports.eventsMediaRelations = exports.eventsMedia = exports.eventsSpeakersRelations = exports.eventsSpeakers = exports.eventsVenueRelations = exports.eventsVenue = exports.eventsPaymentsRelations = exports.eventsPayments = exports.events = exports.layout = exports.hostType = exports.mediaType = exports.eventCostTypeEnum = exports.visibilityEnum = exports.eventTypesEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const tenant_1 = require("../tenant");
const alumni_1 = require("./alumni");
const groups_1 = require("./groups");
exports.eventTypesEnum = (0, pg_core_1.pgEnum)('eventTypes', [
    'virtual',
    'inPerson',
    'hybrid',
]);
exports.visibilityEnum = (0, pg_core_1.pgEnum)('eventVisibility', ['private', 'public']);
exports.eventCostTypeEnum = (0, pg_core_1.pgEnum)('eventCostTypeEnum', ['free', 'paid']);
exports.mediaType = (0, pg_core_1.pgEnum)('mediaType', ['video', 'image']);
exports.hostType = (0, pg_core_1.pgEnum)('hostType', ['host', 'co-host']);
exports.layout = (0, pg_core_1.pgEnum)('layout', ['layout-1', 'layout-2', 'layout-3']);
exports.events = (0, pg_core_1.pgTable)('events', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    eventCreator: (0, pg_core_1.uuid)('eventCreator_id').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    cover: (0, pg_core_1.text)('cover').notNull().default('defaultEventCover.png'),
    name: (0, pg_core_1.text)('eventName').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    eventType: (0, exports.eventTypesEnum)('eventType').notNull(),
    venue: (0, pg_core_1.text)('venue'),
    registrationEndDate: (0, pg_core_1.date)('registrationEndDate').notNull(),
    eventStartTime: (0, pg_core_1.date)('startDate').notNull(),
    eventEndTime: (0, pg_core_1.date)('endDate').notNull(),
    eventVisibility: (0, exports.visibilityEnum)('eventVisibility').notNull(),
    eventDescription: (0, pg_core_1.text)('eventDescription'),
    isAcceptingSponsorShip: (0, pg_core_1.boolean)('isAcceptingSponsorShip')
        .notNull()
        .default(false),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull().default(false),
    isActive: (0, pg_core_1.boolean)('isActive').notNull().default(false),
    group: (0, pg_core_1.uuid)('groupId'),
    details: (0, pg_core_1.text)('details'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    tag: (0, pg_core_1.text)('tag').array(),
});
exports.eventsPayments = (0, pg_core_1.pgTable)('eventsPayments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    eventId: (0, pg_core_1.uuid)('event_Id').notNull(),
    eventCost: (0, exports.eventCostTypeEnum)('eventCostTypeEnum').notNull(),
    costPerAdults: (0, pg_core_1.numeric)('forAdults'),
    costPerChildren: (0, pg_core_1.numeric)('forChildren'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.eventsPaymentsRelations = (0, drizzle_orm_1.relations)(exports.eventsPayments, ({ one, many }) => ({
    event: one(exports.events, {
        fields: [exports.eventsPayments.eventId],
        references: [exports.events.id],
    }),
}));
exports.eventsVenue = (0, pg_core_1.pgTable)('eventsVenue', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    venue: (0, pg_core_1.text)('venue'),
    address: (0, pg_core_1.text)('address'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    eventId: (0, pg_core_1.uuid)('eventId').references(() => exports.events.id),
});
exports.eventsVenueRelations = (0, drizzle_orm_1.relations)(exports.eventsVenue, ({ one, many }) => ({
    event: one(exports.events, {
        fields: [exports.eventsVenue.eventId],
        references: [exports.events.id],
    }),
}));
exports.eventsSpeakers = (0, pg_core_1.pgTable)('eventsSpeakers', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    fullName: (0, pg_core_1.text)('fullName'),
    about: (0, pg_core_1.text)('about'),
    avatar: (0, pg_core_1.text)('avatar'),
    linkedin: (0, pg_core_1.text)('linkedin'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    eventId: (0, pg_core_1.uuid)('eventId')
        .references(() => exports.events.id)
        .notNull(),
});
exports.eventsSpeakersRelations = (0, drizzle_orm_1.relations)(exports.eventsSpeakers, ({ one, many }) => ({
    eventsSpeakerToAgenda: many(exports.eventsSpeakerToAgenda),
    event: one(exports.events, {
        fields: [exports.eventsSpeakers.eventId],
        references: [exports.events.id],
    }),
}));
exports.eventsMedia = (0, pg_core_1.pgTable)('eventsMedia', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    url: (0, pg_core_1.text)('url'),
    mediaType: (0, exports.mediaType)('mediaType'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    eventId: (0, pg_core_1.uuid)('eventId'),
});
exports.eventsMediaRelations = (0, drizzle_orm_1.relations)(exports.eventsMedia, ({ one, many }) => ({
    event: one(exports.events, {
        fields: [exports.eventsMedia.eventId],
        references: [exports.events.id],
    }),
}));
exports.eventsSpeakerToAgenda = (0, pg_core_1.pgTable)('speakers_to_agendas', {
    speaker: (0, pg_core_1.integer)('speaker_id'),
    agenda: (0, pg_core_1.integer)('agenda_id'),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.agenda, table.speaker] }),
        alumniToOrganization: (0, pg_core_1.primaryKey)({
            name: 'alumniOrganization',
            columns: [table.agenda, table.speaker],
        }),
    };
});
exports.eventsSpeakerToAgendaRelations = (0, drizzle_orm_1.relations)(exports.eventsSpeakerToAgenda, ({ one }) => ({
    agenda: one(exports.eventsAgenda, {
        fields: [exports.eventsSpeakerToAgenda.agenda],
        references: [exports.eventsAgenda.id],
    }),
    speaker: one(exports.eventsSpeakers, {
        fields: [exports.eventsSpeakerToAgenda.agenda],
        references: [exports.eventsSpeakers.id],
    }),
}));
exports.eventsAgenda = (0, pg_core_1.pgTable)('eventsAgenda', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    videoSteam: (0, pg_core_1.text)('videoSteam'),
    venue: (0, pg_core_1.text)('venue_id'),
    date: (0, pg_core_1.date)('date').notNull(),
    startTime: (0, pg_core_1.time)('startTime').notNull(),
    endTime: (0, pg_core_1.time)('endTime').notNull(),
    isPublished: (0, pg_core_1.boolean)('isPublished').notNull(),
    isPinned: (0, pg_core_1.boolean)('isPinned').notNull(),
    isDraft: (0, pg_core_1.boolean)('isDraft').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    eventId: (0, pg_core_1.uuid)('eventId')
        .references(() => exports.events.id)
        .notNull(),
});
exports.eventsAgendaRelations = (0, drizzle_orm_1.relations)(exports.eventsAgenda, ({ one, many }) => ({
    eventsSpeakerToAgenda: many(exports.eventsSpeakerToAgenda),
    event: one(exports.events, {
        fields: [exports.eventsAgenda.eventId],
        references: [exports.events.id],
    }),
    venue: one(exports.eventsVenue, {
        fields: [exports.eventsAgenda.venue],
        references: [exports.eventsVenue.id],
    }),
}));
exports.eventsRelations = (0, drizzle_orm_1.relations)(exports.events, ({ one, many }) => ({
    eventsPayments: one(exports.eventsPayments),
    eventHost: many(exports.eventHost),
    eventsAttendees: many(exports.eventsAttendees),
    eventsSettings: one(exports.eventsSettings),
    eventsOrganizer: one(exports.eventsOrganizer),
    eventsSponsorShip: many(exports.eventsSponsorShip),
    eventsVenue: many(exports.eventsVenue),
    eventCreator: one(alumni_1.alumniToOrganization, {
        fields: [exports.events.eventCreator],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    eventSponsors: many(exports.eventSponsors),
    eventsMedia: many(exports.eventsMedia),
    eventsAgenda: many(exports.eventsAgenda),
    eventsSpeakers: many(exports.eventsSpeakers),
    organization: one(tenant_1.organization, {
        fields: [exports.events.organization],
        references: [tenant_1.organization.id],
    }),
    group: one(groups_1.groups, {
        fields: [exports.events.id],
        references: [groups_1.groups.id],
    }),
}));
exports.eventsSponsorShip = (0, pg_core_1.pgTable)('eventsSponsorShip', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    eventId: (0, pg_core_1.uuid)('eventId').references(() => exports.events.id),
    sponsorType: (0, pg_core_1.text)('sponsorType').notNull(),
    price: (0, pg_core_1.numeric)('price').notNull(),
    currency: (0, pg_core_1.text)('currency').notNull(),
    showPrice: (0, pg_core_1.boolean)('showPrice').notNull().default(false),
    content: (0, pg_core_1.json)('content'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.eventsSponsorShipRelations = (0, drizzle_orm_1.relations)(exports.eventsSponsorShip, ({ one, many }) => ({
    eventSponsors: many(exports.eventSponsors),
    event: one(exports.events, {
        fields: [exports.eventsSponsorShip.eventId],
        references: [exports.events.id],
    }),
}));
exports.eventsOrganizer = (0, pg_core_1.pgTable)('eventsOrganizer', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    eventId: (0, pg_core_1.uuid)('event_Id').notNull(),
    eventOrganizerName: (0, pg_core_1.text)('eventsOrganizerName'),
    contactEmail: (0, pg_core_1.text)('contactEmail').notNull(),
    contactNumber: (0, pg_core_1.text)('contactNumber').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.eventsOrganizerRelations = (0, drizzle_orm_1.relations)(exports.eventsOrganizer, ({ one, many }) => ({
    eventsOrganizer: one(exports.events, {
        fields: [exports.eventsOrganizer.eventId],
        references: [exports.events.id],
    }),
}));
exports.eventHost = (0, pg_core_1.pgTable)('eventHost', {
    alumniId: (0, pg_core_1.uuid)('alumni_id').notNull(),
    eventId: (0, pg_core_1.uuid)('event_Id').notNull(),
    hostType: (0, exports.hostType)('hostType').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.alumniId, table.eventId] }),
        alumniToOrganization: (0, pg_core_1.primaryKey)({
            name: 'alumniOrganization',
            columns: [table.alumniId, table.eventId],
        }),
    };
});
exports.eventHostRelations = (0, drizzle_orm_1.relations)(exports.eventHost, ({ one, many }) => ({
    event: one(exports.events, {
        fields: [exports.eventHost.eventId],
        references: [exports.events.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.eventHost.alumniId],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    organization: one(tenant_1.organization, {
        fields: [exports.eventHost.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.eventSponsors = (0, pg_core_1.pgTable)('eventSponsors', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    sponsorName: (0, pg_core_1.text)('sponsorName').notNull(),
    sponsorLogo: (0, pg_core_1.text)('sponsorLogo').notNull(),
    sponsorUserName: (0, pg_core_1.text)('sponsorUserName').notNull(),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull(),
    sponsorUserDesignation: (0, pg_core_1.text)('sponsorUserDesignation').notNull(),
    eventId: (0, pg_core_1.uuid)('event_Id').notNull(),
    sponsorShipId: (0, pg_core_1.uuid)('sponsorship_Id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.eventSponsorsRelations = (0, drizzle_orm_1.relations)(exports.eventSponsors, ({ one, many }) => ({
    event: one(exports.events, {
        fields: [exports.eventSponsors.eventId],
        references: [exports.events.id],
    }),
    sponsorShip: one(exports.eventsSponsorShip, {
        fields: [exports.eventSponsors.sponsorShipId],
        references: [exports.eventsSponsorShip.id],
    }),
}));
exports.eventsSettings = (0, pg_core_1.pgTable)('eventsSettings', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    eventId: (0, pg_core_1.uuid)('event_Id').notNull(),
    layout: (0, exports.layout)('layout').notNull().default('layout-1'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.eventsSettingsRelations = (0, drizzle_orm_1.relations)(exports.eventsSettings, ({ one, many }) => ({
    event: one(exports.events, {
        fields: [exports.eventsSettings.eventId],
        references: [exports.events.id],
    }),
}));
exports.eventsAttendees = (0, pg_core_1.pgTable)('eventsAttendees', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    alumni: (0, pg_core_1.uuid)('alumni_id').notNull(),
    eventId: (0, pg_core_1.uuid)('eventId_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
}, (t) => ({
    unq: (0, pg_core_1.unique)().on(t.alumni, t.eventId),
    unq2: (0, pg_core_1.unique)('uniqueEventsAttendees').on(t.alumni, t.eventId),
}));
exports.eventsAttendeesRelations = (0, drizzle_orm_1.relations)(exports.eventsAttendees, ({ one, many }) => ({
    event: one(exports.events, {
        fields: [exports.eventsAttendees.eventId],
        references: [exports.events.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.eventsAttendees.eventId],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
