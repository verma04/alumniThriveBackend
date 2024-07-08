import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { visibilityEnum } from './events'
import { relations, sql } from 'drizzle-orm'
import { boolean } from 'drizzle-orm/mysql-core'
import { alumniToOrganization } from './alumni'

export const chat = pgTable('chat', {
    id: uuid('id').defaultRandom().primaryKey(),
    user1: integer('user_id'),
    user2: integer('user2_id'),
})

export const chatRelations = relations(chat, ({ one }) => ({
    user1: one(alumniToOrganization, {
        relationName: 'user_id',
        fields: [chat.id],
        references: [alumniToOrganization.alumniId],
    }),

    user2: one(alumniToOrganization, {
        relationName: 'user2_id',
        fields: [chat.id],
        references: [alumniToOrganization.alumniId],
    }),
}))
