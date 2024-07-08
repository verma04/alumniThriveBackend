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
    unique,
    date,
} from 'drizzle-orm/pg-core'
import { platform } from 'os'
import { alumniToOrganization } from './alumni'

export const courseRequest = pgTable('courseRequest', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    fullName: text('fullName').notNull(),
    contactNumber: text('contactNumber').notNull(),
    describes: text('email').notNull(),
    youTubeChannel: text('youTubeChannel'),
    platformDoYouSellCourses: text(' platformDoYouSellCourses'),
    readyCourses: text('readyCourses'),
    averageStudent: text('readyCourses').notNull(),
    user: uuid('user_id').notNull(),
})

export const courseRequestRelations = relations(
    courseRequest,
    ({ one, many }) => ({
        user: one(alumniToOrganization, {
            fields: [courseRequest.user],
            references: [alumniToOrganization.alumniId],
        }),
    })
)
