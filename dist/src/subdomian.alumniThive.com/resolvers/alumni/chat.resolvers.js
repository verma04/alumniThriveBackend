"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
const CHAT_CHANNEL = 'CHAT_CHANNEL';
const chatResolvers = {
    Query: {
        async getAllMessages(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                console.log(input);
                const checkChat = await _drizzle_1.db.query.chat.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.chat.id, input.id)),
                    with: {
                        messages: {
                            with: {
                                sender: true,
                                marketPlace: true,
                            },
                        },
                    },
                });
                return checkChat.messages;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async startChat(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                if (id === input.userID) {
                    return new graphql_1.GraphQLError('Action not Allowed', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const checkChat = await _drizzle_1.db.query.chat.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.chat.user1, input.userID), (0, drizzle_orm_1.eq)(schema_1.chat.user1, id)), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.chat.user2, id), (0, drizzle_orm_1.eq)(schema_1.chat.user2, input.userID))),
                });
                if (checkChat) {
                    return checkChat;
                }
                const newChat = await _drizzle_1.db
                    .insert(schema_1.chat)
                    .values({
                    user1: id,
                    user2: input.userID,
                })
                    .returning();
                return newChat[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async sendMessageInChat(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const newChat = await _drizzle_1.db
                    .insert(schema_1.messages)
                    .values({
                    chatId: input.chatId,
                    content: input.content,
                    senderId: id,
                })
                    .returning();
                const details = await _drizzle_1.db.query.messages.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.id, newChat[0].id)),
                    with: {
                        sender: true,
                    },
                });
                pubsub.publish(CHAT_CHANNEL, {
                    message: details,
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Subscription: {
        message: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub.asyncIterator('CHAT_CHANNEL'), (payload, variables) => {
                return payload.message.chatId === variables.id;
            }),
        },
    },
};
exports.chatResolvers = chatResolvers;
let currentNumber = 0;
function incrementNumber() {
    currentNumber++;
    pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
    setTimeout(incrementNumber, 1000);
}
// Start incrementing
incrementNumber();
