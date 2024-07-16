"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpResolvers = void 0;
const issues_1 = require("./issues");
const helpResolvers = {
    Query: {
        ...issues_1.issuesResolvers.Query,
    },
    Mutation: {
        ...issues_1.issuesResolvers.Mutation,
    },
};
exports.helpResolvers = helpResolvers;
