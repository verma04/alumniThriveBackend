"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking')
const settingTypes = (0, apollo_server_core_1.gql) `
    type groupSetting {
        autoApprove: Boolean
        views: Boolean
        discussion: Boolean
        user: Boolean
    }
    type Query {
        getGroupSettings: groupSetting
    }

    input updateSettings {
        autoApprove: Boolean
        views: Boolean
        discussion: Boolean
        user: Boolean
    }

    type Mutation {
        updateGroupSettings(input: updateSettings): groupSetting
    }
`;
exports.settingTypes = settingTypes;
