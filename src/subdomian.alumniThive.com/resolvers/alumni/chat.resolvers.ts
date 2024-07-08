import { and, eq } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    alumniConnection,
    alumniRequest,
    alumniToOrganization,
} from '../../../../@drizzle/src/db/schema'
import { connectInput } from '../../ts-types/directory-types'
import { GraphQLError } from 'graphql'
import { connection } from 'mongoose'
import { PubSub, withFilter } from 'graphql-subscriptions'
const pubsub = new PubSub()
const CHAT_CHANNEL = 'CHAT_CHANNEL'
const chatResolvers = {
    Subscription: {
        numberIncremented: {
            subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
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
