"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const chatTypes = (0, apollo_server_core_1.gql) `
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
`;
exports.chatTypes = chatTypes;
