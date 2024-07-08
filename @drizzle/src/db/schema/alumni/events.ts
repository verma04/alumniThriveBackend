import { relations, sql } from 'drizzle-orm'
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
    pgEnum,
    json,
    primaryKey,
    numeric,
    date,
    time,
    unique,
} from 'drizzle-orm/pg-core'
import { organization } from '../tenant'
import { alumniToOrganization } from './alumni'

import { groups } from './groups'

export const eventTypesEnum = pgEnum('eventTypes', [
    'virtual',
    'inPerson',
    'hybrid',
])
export const visibilityEnum = pgEnum('eventVisibility', ['private', 'public'])
export const eventCostTypeEnum = pgEnum('eventCostTypeEnum', ['free', 'paid'])

export const mediaType = pgEnum('mediaType', ['video', 'image'])
export const hostType = pgEnum('hostType', ['host', 'co-host'])

export const layout = pgEnum('layout', ['layout-1', 'layout-2', 'layout-3'])
export const events = pgTable('events', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventCreator: uuid('eventCreator_id').notNull(),
    organization: uuid('org_id').notNull(),
    cover: text('cover').notNull().default('defaultEventCover.png'),
    name: text('eventName').notNull(),
    slug: text('slug').notNull().unique(),
    eventType: eventTypesEnum('eventType').notNull(),
    venue: text('venue'),
    registrationEndDate: date('registrationEndDate').notNull(),
    eventStartTime: date('startDate').notNull(),
    eventEndTime: date('endDate').notNull(),
    eventVisibility: visibilityEnum('eventVisibility').notNull(),
    eventDescription: text('eventDescription'),
    isAcceptingSponsorShip: boolean('isAcceptingSponsorShip')
        .notNull()
        .default(false),
    isApproved: boolean('isApproved').notNull().default(false),
    isActive: boolean('isActive').notNull().default(false),
    group: uuid('groupId'),
    details: text('details'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    tag: text('tag').array(),
})

export const eventsPayments = pgTable('eventsPayments', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_Id').notNull(),
    eventCost: eventCostTypeEnum('eventCostTypeEnum').notNull(),
    costPerAdults: numeric('forAdults'),
    costPerChildren: numeric('forChildren'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const eventsPaymentsRelations = relations(
    eventsPayments,
    ({ one, many }) => ({
        event: one(events, {
            fields: [eventsPayments.eventId],
            references: [events.id],
        }),
    })
)

export const eventsVenue = pgTable('eventsVenue', {
    id: uuid('id').defaultRandom().primaryKey(),
    venue: text('venue'),
    address: text('address'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    eventId: uuid('eventId').references(() => events.id),
})
export const eventsVenueRelations = relations(eventsVenue, ({ one, many }) => ({
    event: one(events, {
        fields: [eventsVenue.eventId],
        references: [events.id],
    }),
}))

export const eventsSpeakers = pgTable('eventsSpeakers', {
    id: uuid('id').defaultRandom().primaryKey(),
    fullName: text('fullName'),
    about: text('about'),
    avatar: text('avatar'),
    linkedin: text('linkedin'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    eventId: uuid('eventId')
        .references(() => events.id)
        .notNull(),
})
export const eventsSpeakersRelations = relations(
    eventsSpeakers,
    ({ one, many }) => ({
        eventsSpeakerToAgenda: many(eventsSpeakerToAgenda),
        event: one(events, {
            fields: [eventsSpeakers.eventId],
            references: [events.id],
        }),
    })
)

export const eventsMedia = pgTable('eventsMedia', {
    id: uuid('id').defaultRandom().primaryKey(),
    url: text('url'),
    mediaType: mediaType('mediaType'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    eventId: uuid('eventId'),
})
export const eventsMediaRelations = relations(eventsMedia, ({ one, many }) => ({
    event: one(events, {
        fields: [eventsMedia.eventId],
        references: [events.id],
    }),
}))

export const eventsSpeakerToAgenda = pgTable(
    'speakers_to_agendas',
    {
        speaker: integer('speaker_id'),

        agenda: integer('agenda_id'),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.agenda, table.speaker] }),
            alumniToOrganization: primaryKey({
                name: 'alumniOrganization',
                columns: [table.agenda, table.speaker],
            }),
        }
    }
)
export const eventsSpeakerToAgendaRelations = relations(
    eventsSpeakerToAgenda,
    ({ one }) => ({
        agenda: one(eventsAgenda, {
            fields: [eventsSpeakerToAgenda.agenda],
            references: [eventsAgenda.id],
        }),
        speaker: one(eventsSpeakers, {
            fields: [eventsSpeakerToAgenda.agenda],
            references: [eventsSpeakers.id],
        }),
    })
)
export const eventsAgenda = pgTable('eventsAgenda', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    videoSteam: text('videoSteam'),
    venue: text('venue_id'),
    date: date('date').notNull(),
    startTime: time('startTime').notNull(),
    endTime: time('endTime').notNull(),
    isPublished: boolean('isPublished').notNull(),
    isPinned: boolean('isPinned').notNull(),
    isDraft: boolean('isDraft').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    eventId: uuid('eventId')
        .references(() => events.id)
        .notNull(),
})
export const eventsAgendaRelations = relations(
    eventsAgenda,
    ({ one, many }) => ({
        eventsSpeakerToAgenda: many(eventsSpeakerToAgenda),
        event: one(events, {
            fields: [eventsAgenda.eventId],
            references: [events.id],
        }),
        venue: one(eventsVenue, {
            fields: [eventsAgenda.venue],
            references: [eventsVenue.id],
        }),
    })
)

export const eventsRelations = relations(events, ({ one, many }) => ({
    eventsPayments: one(eventsPayments),
    eventHost: many(eventHost),
    eventsAttendees: many(eventsAttendees),
    eventsSettings: one(eventsSettings),
    eventsOrganizer: one(eventsOrganizer),
    eventsSponsorShip: many(eventsSponsorShip),
    eventsVenue: many(eventsVenue),
    eventCreator: one(alumniToOrganization, {
        fields: [events.eventCreator],
        references: [alumniToOrganization.alumniId],
    }),
    eventSponsors: many(eventSponsors),
    eventsMedia: many(eventsMedia),
    eventsAgenda: many(eventsAgenda),
    eventsSpeakers: many(eventsSpeakers),
    organization: one(organization, {
        fields: [events.organization],
        references: [organization.id],
    }),
    group: one(groups, {
        fields: [events.id],
        references: [groups.id],
    }),
}))

export const eventsSponsorShip = pgTable('eventsSponsorShip', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('eventId').references(() => events.id),
    sponsorType: text('sponsorType').notNull(),
    price: numeric('price').notNull(),
    currency: text('currency').notNull(),
    showPrice: boolean('showPrice').notNull().default(false),
    content: json('content'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const eventsSponsorShipRelations = relations(
    eventsSponsorShip,
    ({ one, many }) => ({
        eventSponsors: many(eventSponsors),
        event: one(events, {
            fields: [eventsSponsorShip.eventId],
            references: [events.id],
        }),
    })
)

export const eventsOrganizer = pgTable('eventsOrganizer', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_Id').notNull(),
    eventOrganizerName: text('eventsOrganizerName'),
    contactEmail: text('contactEmail').notNull(),
    contactNumber: text('contactNumber').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const eventsOrganizerRelations = relations(
    eventsOrganizer,
    ({ one, many }) => ({
        eventsOrganizer: one(events, {
            fields: [eventsOrganizer.eventId],
            references: [events.id],
        }),
    })
)

export const eventHost = pgTable(
    'eventHost',
    {
        alumniId: uuid('alumni_id').notNull(),
        eventId: uuid('event_Id').notNull(),
        hostType: hostType('hostType').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
        organization: uuid('organization_id').notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.alumniId, table.eventId] }),
            alumniToOrganization: primaryKey({
                name: 'alumniOrganization',
                columns: [table.alumniId, table.eventId],
            }),
        }
    }
)

export const eventHostRelations = relations(eventHost, ({ one, many }) => ({
    event: one(events, {
        fields: [eventHost.eventId],
        references: [events.id],
    }),
    alumni: one(alumniToOrganization, {
        fields: [eventHost.alumniId],
        references: [alumniToOrganization.alumniId],
    }),
    organization: one(organization, {
        fields: [eventHost.organization],
        references: [organization.id],
    }),
}))

export const eventSponsors = pgTable('eventSponsors', {
    id: uuid('id').defaultRandom().primaryKey(),
    sponsorName: text('sponsorName').notNull(),
    sponsorLogo: text('sponsorLogo').notNull(),
    sponsorUserName: text('sponsorUserName').notNull(),
    isApproved: boolean('isApproved').notNull(),
    sponsorUserDesignation: text('sponsorUserDesignation').notNull(),
    eventId: uuid('event_Id').notNull(),
    sponsorShipId: uuid('sponsorship_Id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const eventSponsorsRelations = relations(
    eventSponsors,
    ({ one, many }) => ({
        event: one(events, {
            fields: [eventSponsors.eventId],
            references: [events.id],
        }),
        sponsorShip: one(eventsSponsorShip, {
            fields: [eventSponsors.sponsorShipId],
            references: [eventsSponsorShip.id],
        }),
    })
)

export const eventsSettings = pgTable('eventsSettings', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_Id').notNull(),
    layout: layout('layout').notNull().default('layout-1'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const eventsSettingsRelations = relations(
    eventsSettings,
    ({ one, many }) => ({
        event: one(events, {
            fields: [eventsSettings.eventId],
            references: [events.id],
        }),
    })
)

export const eventsAttendees = pgTable(
    'eventsAttendees',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        alumni: uuid('alumni_id').notNull(),
        eventId: uuid('eventId_id').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    },
    (t) => ({
        unq: unique().on(t.alumni, t.eventId),
        unq2: unique('uniqueEventsAttendees').on(t.alumni, t.eventId),
    })
)

export const eventsAttendeesRelations = relations(
    eventsAttendees,
    ({ one, many }) => ({
        event: one(events, {
            fields: [eventsAttendees.eventId],
            references: [events.id],
        }),
        alumni: one(alumniToOrganization, {
            fields: [eventsAttendees.eventId],
            references: [alumniToOrganization.alumniId],
        }),
    })
)
