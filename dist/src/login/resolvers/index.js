"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_resolvers_1 = require("./admin/login.resolvers");
const resolvers = {
    Query: {
        ...login_resolvers_1.loginResolvers.Query,
    },
    Mutation: {
        ...login_resolvers_1.loginResolvers.Mutation,
    },
};
exports.default = resolvers;
