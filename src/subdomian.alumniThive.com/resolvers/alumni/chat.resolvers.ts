import { and, eq, or } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    alumniConnection,
    alumniRequest,
    alumniToOrganization,
    chat,
    messages,
} from '../../../../@drizzle/src/db/schema'
import { connectInput } from '../../ts-types/directory-types'
import { GraphQLError } from 'graphql'
import { connection } from 'mongoose'
import { PubSub, withFilter } from 'graphql-subscriptions'
const pubsub = new PubSub()
const CHAT_CHANNEL = 'CHAT_CHANNEL'
const chatResolvers = {
    Query: {
        async getAllMessages(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)
                console.log(input)
                const checkChat = await db.query.chat.findFirst({
                    where: and(eq(chat.id, input.id)),
                    with: {
                        messages: {
                            with: {
                                sender: true,
                                marketPlace: true,
                            },
                        },
                    },
                })

                return checkChat.messages
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },

    Mutation: {
        async startChat(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                if (id === input.userID) {
                    return new GraphQLError('Action not Allowed', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                const checkChat = await db.query.chat.findFirst({
                    where: and(
                        or(eq(chat.user1, input.userID), eq(chat.user1, id)),
                        or(eq(chat.user2, id), eq(chat.user2, input.userID))
                    ),
                })

                if (checkChat) {
                    return checkChat
                }

                const newChat = await db
                    .insert(chat)
                    .values({
                        user1: id,
                        user2: input.userID,
                    })
                    .returning()

                return newChat[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async sendMessageInChat(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const newChat = await db
                    .insert(messages)
                    .values({
                        chatId: input.chatId,
                        content: input.content,
                        senderId: id,
                    })
                    .returning()

                const details = await db.query.messages.findFirst({
                    where: and(eq(messages.id, newChat[0].id)),
                    with: {
                        sender: true,
                    },
                })

                pubsub.publish(CHAT_CHANNEL, {
                    message: details,
                })
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },

    Subscription: {
        message: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('CHAT_CHANNEL'),
                (payload, variables) => {
                    return payload.message.chatId === variables.id
                }
            ),
        },
    },
}

export { chatResolvers }
let currentNumber = 0
function incrementNumber() {
    currentNumber++
    pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber })
    setTimeout(incrementNumber, 1000)
}

// Start incrementing
incrementNumber()
