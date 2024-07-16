"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRelations = exports.loginSession = exports.otpRelations = exports.otp = exports.profileInfoRelations = exports.profileInfo = exports.usersRelations = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const organization_1 = require("../organizationSchema/organization");
exports.users = (0, pg_core_1.pgTable)('admin', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    firstName: (0, pg_core_1.text)('firstName').notNull(),
    lastName: (0, pg_core_1.text)('lastName').notNull(),
    password: (0, pg_core_1.text)('password').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    otp: one(exports.otp),
    organization: one(organization_1.organization),
    profileInfo: one(exports.profileInfo),
    posts: many(exports.loginSession),
}));
exports.profileInfo = (0, pg_core_1.pgTable)('profileInfo', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    designation: (0, pg_core_1.text)('designation').notNull(),
    phone: (0, pg_core_1.text)('phone').notNull(),
});
exports.profileInfoRelations = (0, drizzle_orm_1.relations)(exports.profileInfo, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.profileInfo.userId],
        references: [exports.users.id],
    }),
}));
exports.otp = (0, pg_core_1.pgTable)('otp', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id),
    otp: (0, pg_core_1.text)('otp').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    timeOfExpire: (0, pg_core_1.integer)('timeOfExpire').default(10),
    isExpired: (0, pg_core_1.boolean)('isExpired').default(false),
});
exports.otpRelations = (0, drizzle_orm_1.relations)(exports.otp, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.otp.userId],
        references: [exports.users.id],
    }),
}));
exports.loginSession = (0, pg_core_1.pgTable)('session', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    token: (0, pg_core_1.text)('token').notNull(),
    ip: (0, pg_core_1.text)('ip'),
    deviceOs: (0, pg_core_1.text)('deviceOs'),
    deviceId: (0, pg_core_1.uuid)('deviceId').defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    ipAddress: (0, pg_core_1.text)('ipAddress'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    logout: (0, pg_core_1.boolean)('logout').default(false),
});
exports.loginRelations = (0, drizzle_orm_1.relations)(exports.loginSession, ({ one }) => ({
    author: one(exports.users, {
        fields: [exports.loginSession.userId],
        references: [exports.users.id],
    }),
}));
