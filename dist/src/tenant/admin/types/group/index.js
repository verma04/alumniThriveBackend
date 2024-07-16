"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const approval_types_1 = require("./approval.types");
const interests_types_1 = require("./interests.types");
const settingsTypes_1 = require("./settingsTypes");
const theme_types_1 = require("./theme.types");
const groupTypes = [interests_types_1.interestsTypes, theme_types_1.themeTypes, settingsTypes_1.settingTypes, approval_types_1.approvalTypes];
exports.default = groupTypes;
