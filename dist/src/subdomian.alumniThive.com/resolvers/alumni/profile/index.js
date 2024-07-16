"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileResolvers = void 0;
const tag_resolvers_1 = require("./tag.resolvers");
const profileResolvers = {
    Query: {
        ...tag_resolvers_1.tagResolvers.Query,
    },
    Mutation: {
        ...tag_resolvers_1.tagResolvers.Mutation,
    },
};
exports.profileResolvers = profileResolvers;
