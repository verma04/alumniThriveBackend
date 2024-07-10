import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking');
const chatTypes = gql`
    scalar Upload

    input chatID {
        userID: ID
    }
    input inputSendMessage {
        chatId: ID!
        content: String!
    }

    input inputChat {
        userID: ID
    }

    input messageID {
        id: ID
    }

    type chat {
        id: ID
    }
    type sender {
        id: ID
        firstName: String
        avatar: String
        lastName: String
    }
    type messages {
        id: ID
        content: String
        sender: sender
        marketPlace: MarketPlace
        messageType: String
    }
    type Query {
        getAllMessages(input: messageID): [messages]
    }
    type Mutation {
        sendMessageInChat(input: inputSendMessage): [chat]
        startChat(input: chatID): chat
    }
    type Subscription {
        message(id: ID!): messages
    }
`

export { chatTypes }
