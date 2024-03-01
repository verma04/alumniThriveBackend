// npm install @apollo/server express graphql cors
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import * as dotenv from "dotenv";
import { GraphQLError } from "graphql";
dotenv.config();

const {
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");
import { constraintDirective } from "graphql-constraint-directive";
const { makeExecutableSchema } = require("@graphql-tools/schema");
import resolvers from "./resolvers";
import typeDefs from "./types";
interface MyContext {
  token?: string;
}

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

(async function () {
  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  let schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers,
  });
  await constraintDirective()(schema);
  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Ensure we wait for our server to start
  await server.start();
  app.use(graphqlUploadExpress());
  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json(),

    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => {
        return req;
      },
    })
  );

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.LOGIN_DOMAIN }, resolve)
  );
  console.log(`🚀 Server ready at ${process.env.LOGIN_DOMAIN}`);
})();
