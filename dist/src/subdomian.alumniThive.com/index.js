"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// npm install @apollo/server express graphql cors
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
dotenv.config();
const body_parser_1 = __importDefault(require("body-parser"));
const { graphqlUploadExpress, // A Koa implementation is also exported.
 } = require('graphql-upload');
//@ts-ignore
const graphql_constraint_directive_1 = require("graphql-constraint-directive");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers_1 = __importDefault(require("./resolvers"));
const types_1 = __importDefault(require("./types"));
// Required logic for integrating with Express
const app = (0, express_1.default)();
app.use(require('express-status-monitor')());
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http_1.default.createServer(app);
(async function () {
    // Same ApolloServer initialization as before, plus the drain plugin
    // for our httpServer.
    const schema = makeExecutableSchema({
        typeDefs: types_1.default,
        resolvers: resolvers_1.default,
    });
    const wsServer = new ws_1.WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if app.use
        // serves expressMiddleware at a different path
        path: '/',
    });
    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
    await (0, graphql_constraint_directive_1.constraintDirective)()(schema);
    const server = new server_1.ApolloServer({
        schema,
        plugins: [
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    // Ensure we wait for our server to start
    await server.start();
    app.use(graphqlUploadExpress());
    app.use(body_parser_1.default.json({ limit: '50mb' }));
    app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
    // Set up our Express middleware to handle CORS, body parsing,
    // and our expressMiddleware function.
    app.use('/', (0, cors_1.default)(), express_1.default.json(), 
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            return req;
        },
    }));
    // Modified server startup
    await new Promise((resolve) => httpServer.listen({ port: process.env.SUB_DOMAIN }, resolve));
    console.log(`🚀 Server ready at ${process.env.SUB_DOMAIN}`);
})();
