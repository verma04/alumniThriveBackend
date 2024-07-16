"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobApplicantRelations = exports.jobApplicant = exports.jobsRelations = exports.jobs = exports.workplaceTypeEnum = exports.jobTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const groups_1 = require("./groups");
const alumni_1 = require("./alumni");
exports.jobTypeEnum = (0, pg_core_1.pgEnum)('jobType', [
    'full-time',
    'part-time',
    'contract',
    'temporary',
    'internship',
    'volunteer',
    'other',
]);
exports.workplaceTypeEnum = (0, pg_core_1.pgEnum)('workplaceType', [
    'on-Site',
    'hybrid',
    'remote',
]);
exports.jobs = (0, pg_core_1.pgTable)('jobs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    postedBy: (0, pg_core_1.uuid)('postedBy_id').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    jobTitle: (0, pg_core_1.text)('jobTitle').notNull(),
    company: (0, pg_core_1.text)('company').notNull(),
    salary: (0, pg_core_1.text)('salary').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    description: (0, pg_core_1.text)('description').notNull(),
    location: (0, pg_core_1.text)('location').notNull(),
    jobType: (0, exports.jobTypeEnum)('eventType').notNull(),
    workplaceType: (0, exports.workplaceTypeEnum)('workplaceType').notNull(),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull().default(false),
    isActive: (0, pg_core_1.boolean)('isActive').notNull().default(false),
    group: (0, pg_core_1.uuid)('groupId'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    tag: (0, pg_core_1.json)('tag'),
    experience: (0, pg_core_1.text)('experience').notNull(),
});
exports.jobsRelations = (0, drizzle_orm_1.relations)(exports.jobs, ({ one, many }) => ({
    group: one(groups_1.groups, {
        fields: [exports.jobs.id],
        references: [groups_1.groups.id],
    }),
    postedBy: one(alumni_1.alumniToOrganization, {
        fields: [exports.jobs.id],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    jobApplicant: many(exports.jobApplicant),
}));
exports.jobApplicant = (0, pg_core_1.pgTable)('jobApplicant', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    alumni: (0, pg_core_1.uuid)('alumni_id').notNull(),
    jobId: (0, pg_core_1.uuid)('jobs_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    fullName: (0, pg_core_1.text)('fullName').notNull(),
    email: (0, pg_core_1.text)('email').notNull(),
    phone: (0, pg_core_1.text)('phone').notNull(),
    resume: (0, pg_core_1.text)('resume').notNull(),
}, (t) => ({
    unq: (0, pg_core_1.unique)().on(t.alumni, t.jobId),
    unq2: (0, pg_core_1.unique)('uniqueJobApplicant').on(t.alumni, t.jobId),
}));
exports.jobApplicantRelations = (0, drizzle_orm_1.relations)(exports.jobApplicant, ({ one, many }) => ({
    job: one(exports.jobs, {
        fields: [exports.jobApplicant.jobId],
        references: [exports.jobs.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.jobApplicant.alumni],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
