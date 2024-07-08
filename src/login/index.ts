// npm install @apollo/server express graphql cors
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import * as dotenv from 'dotenv'

dotenv.config()

const {
    graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload')
import { constraintDirective } from 'graphql-constraint-directive'
const { makeExecutableSchema } = require('@graphql-tools/schema')
import resolvers from './resolvers'
import typeDefs from './types'
interface MyContext {
    token?: string
}

const app = express()

const httpServer = http.createServer(app)

;(async function () {
    const schema = makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers,
    })
    await constraintDirective()(schema)
    const server = new ApolloServer<MyContext>({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })

    await server.start()
    app.use(graphqlUploadExpress())

    app.use(
        '/',
        cors<cors.CorsRequest>(),
        express.json(),

        expressMiddleware(server, {
            context: async ({ req }) => {
                return req
            },
        })
    )

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: process.env.LOGIN_DOMAIN }, resolve)
    )
    console.log(`🚀 Server ready at ${process.env.LOGIN_DOMAIN}`)
})()
