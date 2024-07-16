"use strict";
// import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";
// dotenv.config();
// ("./");
// export default {
//   schema: "./@drizzle/src/db/schema",
//   out: "./drizzle",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.POSTGRES_DATABASE_URL as string,
//   },
// } satisfies Config;
// import { defineConfig } from "drizzle-kit";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default defineConfig({
//   dialect: "postgresql",
// });
const dotenv = __importStar(require("dotenv"));
const drizzle_kit_1 = require("drizzle-kit");
dotenv.config({
    path: '.env',
});
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './@drizzle/src/db/schema',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_DATABASE_URL,
    },
});
