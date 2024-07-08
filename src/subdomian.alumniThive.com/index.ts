// npm install @apollo/server express graphql cors
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
dotenv.config()

const {
    graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload')
//@ts-ignore
import { constraintDirective } from 'graphql-constraint-directive'
const { makeExecutableSchema } = require('@graphql-tools/schema')
import resolvers from './resolvers'
import typeDefs from './types'
interface MyContext {
    token?: string
}

// Required logic for integrating with Express
const app = express()
app.use(require('express-status-monitor')())
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app)

;(async function () {
    // Same ApolloServer initialization as before, plus the drain plugin
    // for our httpServer.
    const schema = makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers,
    })
    const wsServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if app.use
        // serves expressMiddleware at a different path
        path: '/',
    })

    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = useServer({ schema }, wsServer)
    await constraintDirective()(schema)
    const server = new ApolloServer<MyContext>({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
        ],
    })
    // Ensure we wait for our server to start
    await server.start()
    app.use(graphqlUploadExpress())
    // Set up our Express middleware to handle CORS, body parsing,
    // and our expressMiddleware function.
    app.use(
        '/',
        cors<cors.CorsRequest>(),
        express.json(),

        // expressMiddleware accepts the same arguments:
        // an Apollo Server instance and optional configuration options
        expressMiddleware(server, {
            context: async ({ req }) => {
                return req
            },
        })
    )

    // Modified server startup
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: process.env.SUB_DOMAIN }, resolve)
    )
    console.log(`🚀 Server ready at ${process.env.SUB_DOMAIN}`)
})()
