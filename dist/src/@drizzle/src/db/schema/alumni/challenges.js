"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengesAddress = exports.challenges = exports.challengesParticipationType = exports.challengeMode = exports.challengesVisibility = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.challengesVisibility = (0, pg_core_1.pgEnum)('challengesVisibility', [
    'public',
    'private',
]);
exports.challengeMode = (0, pg_core_1.pgEnum)('challengesMode', ['online', 'offline']);
exports.challengesParticipationType = (0, pg_core_1.pgEnum)('challengesParticipationType', ['individual', 'team']);
exports.challenges = (0, pg_core_1.pgTable)('challenges', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    challengesVisibility: (0, exports.challengesVisibility)('challengesVisibility').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    association: (0, pg_core_1.uuid)('association_id').notNull(),
    website_url: (0, pg_core_1.text)('website_url').notNull(),
    challengeMode: (0, exports.challengeMode)('challengesMode').notNull(),
    about: (0, pg_core_1.text)('about').notNull(),
    registrationEndTime: (0, pg_core_1.date)('registrationEndTime').notNull(),
    registrationStartTime: (0, pg_core_1.date)('registrationStartTime').notNull(),
    challengesParticipationType: (0, exports.challengesParticipationType)('challengesParticipationType').notNull(),
    mimMember: (0, pg_core_1.varchar)('mimMember'),
    maxMember: (0, pg_core_1.varchar)('maxMember'),
    numberOfRegistrations: (0, pg_core_1.varchar)('maxMember'),
});
exports.challengesAddress = (0, pg_core_1.pgTable)('challengesAddress', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    location: (0, pg_core_1.text)('location').notNull(),
    state: (0, pg_core_1.text)('state').notNull(),
    city: (0, pg_core_1.text)('city').notNull(),
    country: (0, pg_core_1.text)('country').notNull(),
    challenge: (0, pg_core_1.uuid)('challenges_id').notNull(),
});
