"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const approval_resolvers_1 = require("./approval.resolvers");
const interests_resolvers_1 = require("./interests.resolvers");
const settings_resolvers_1 = require("./settings.resolvers");
const theme_resolvers_1 = require("./theme.resolvers");
const groupsResolvers = {
    Query: {
        ...theme_resolvers_1.themeResolvers.Query,
        ...interests_resolvers_1.interestsResolvers.Query,
        ...settings_resolvers_1.settingsResolvers.Query,
        ...approval_resolvers_1.approvalResolvers.Query,
    },
    Mutation: {
        ...theme_resolvers_1.themeResolvers.Mutation,
        ...interests_resolvers_1.interestsResolvers.Mutation,
        ...settings_resolvers_1.settingsResolvers.Mutation,
        ...approval_resolvers_1.approvalResolvers.Mutation,
    },
};
exports.default = groupsResolvers;
