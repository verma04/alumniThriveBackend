"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homepage_resolvers_1 = require("./homepage.resolvers");
const websiteResolvers = {
    Query: {
        ...homepage_resolvers_1.homePageResolvers.Query,
    },
    Mutation: {
        ...homepage_resolvers_1.homePageResolvers.Mutation,
    },
};
exports.default = websiteResolvers;
