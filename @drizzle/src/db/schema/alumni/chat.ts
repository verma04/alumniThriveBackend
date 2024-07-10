import {
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core'

import { relations, sql } from 'drizzle-orm'

import { alumni, alumniToOrganization } from './alumni'
import { mentorShip } from './mentor'
import { marketPlace } from './marketPlace'

export const messageTypeEnum = pgEnum('messageTypeEnum', [
    'message',
    'marketPlace',
])
export const chat = pgTable(
    'chats',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        user1: uuid('user_id'),
        user2: uuid('user2_id'),
    },
    (table) => {
        return {
            userPairIndex: uniqueIndex('user_pair_idx').on(
                table.user1,
                table.user2
            ),
        }
    }
)

export const chatRelations = relations(chat, ({ one, many }) => ({
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
    messages: many(messages),
}))

export const messages = pgTable('chat_messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    chatId: uuid('chat_id').notNull(),
    senderId: uuid('sender_id').notNull(),
    content: text('content').notNull(),
    sentAt: timestamp('sent_at').notNull().defaultNow(),
    messageType: messageTypeEnum('messageTypeEnum')
        .notNull()
        .default('message'),
    marketPlace: uuid('marketPlace_id'),
})

export const messagesRelations = relations(messages, ({ one, many }) => ({
    chat: one(chat, {
        fields: [messages.chatId],
        references: [chat.id],
    }),

    sender: one(alumni, {
        fields: [messages.senderId],
        references: [alumni.id],
    }),
    marketPlace: one(marketPlace, {
        fields: [messages.marketPlace],
        references: [marketPlace.id],
    }),
}))
