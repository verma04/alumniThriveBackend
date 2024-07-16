"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRelations = exports.messages = exports.chatRelations = exports.chat = exports.messageTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const alumni_1 = require("./alumni");
const marketPlace_1 = require("./marketPlace");
exports.messageTypeEnum = (0, pg_core_1.pgEnum)('messageTypeEnum', [
    'message',
    'marketPlace',
]);
exports.chat = (0, pg_core_1.pgTable)('chats', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    user1: (0, pg_core_1.uuid)('user_id'),
    user2: (0, pg_core_1.uuid)('user2_id'),
}, (table) => {
    return {
        userPairIndex: (0, pg_core_1.uniqueIndex)('user_pair_idx').on(table.user1, table.user2),
    };
});
exports.chatRelations = (0, drizzle_orm_1.relations)(exports.chat, ({ one, many }) => ({
    user1: one(alumni_1.alumniToOrganization, {
        relationName: 'user_id',
        fields: [exports.chat.id],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    user2: one(alumni_1.alumniToOrganization, {
        relationName: 'user2_id',
        fields: [exports.chat.id],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    messages: many(exports.messages),
}));
exports.messages = (0, pg_core_1.pgTable)('chat_messages', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    chatId: (0, pg_core_1.uuid)('chat_id').notNull(),
    senderId: (0, pg_core_1.uuid)('sender_id').notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    sentAt: (0, pg_core_1.timestamp)('sent_at').notNull().defaultNow(),
    messageType: (0, exports.messageTypeEnum)('messageTypeEnum')
        .notNull()
        .default('message'),
    marketPlace: (0, pg_core_1.uuid)('marketPlace_id'),
});
exports.messagesRelations = (0, drizzle_orm_1.relations)(exports.messages, ({ one, many }) => ({
    chat: one(exports.chat, {
        fields: [exports.messages.chatId],
        references: [exports.chat.id],
    }),
    sender: one(alumni_1.alumni, {
        fields: [exports.messages.senderId],
        references: [alumni_1.alumni.id],
    }),
    marketPlace: one(marketPlace_1.marketPlace, {
        fields: [exports.messages.marketPlace],
        references: [marketPlace_1.marketPlace.id],
    }),
}));
