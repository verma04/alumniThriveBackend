"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedBackQuestionRelations = exports.feedBackQuestion = exports.feedBackRelations = exports.feedBack = exports.questionType = exports.feedBackType = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const tenant_1 = require("../tenant");
const alumni_1 = require("./alumni");
exports.feedBackType = (0, pg_core_1.pgEnum)('feedBackType', ['event', 'group', 'jobs']);
exports.questionType = (0, pg_core_1.pgEnum)('questionType', [
    'multipleChoice',
    'shortText',
    // "longText",
    // "yes/no",
    // "email",
    // "fileUpload",
    // "date",
    // "number",
    // "date",
    // "dropdown",
    // "fileUpload",
    // "website",
    // "legal",
    // "contact",
    // "address",
    // "phone",
    // "pictureChoice",
    // "opinionScale",
    // "rating",
]);
exports.feedBack = (0, pg_core_1.pgTable)('feedback', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    feedBackType: (0, exports.feedBackType)('feedBackType').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    organization: (0, pg_core_1.uuid)('organization_id').notNull(),
    alumni: (0, pg_core_1.uuid)('alumni_id').notNull(),
});
exports.feedBackRelations = (0, drizzle_orm_1.relations)(exports.feedBack, ({ one, many }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.feedBack.organization],
        references: [tenant_1.organization.id],
    }),
    alumni: one(alumni_1.alumniToOrganization, {
        fields: [exports.feedBack.alumni],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    feedBackQuestion: many(exports.feedBackQuestion),
}));
exports.feedBackQuestion = (0, pg_core_1.pgTable)('feedBackQuestion', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    isRequired: (0, pg_core_1.boolean)('isRequired').default(false).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    questionType: (0, exports.questionType)('questionType').notNull(),
    feedBack: (0, pg_core_1.uuid)('feedBack_id').notNull(),
});
exports.feedBackQuestionRelations = (0, drizzle_orm_1.relations)(exports.feedBackQuestion, ({ one, many }) => ({
    feedBack: one(exports.feedBack, {
        fields: [exports.feedBackQuestion.feedBack],
        references: [exports.feedBack.id],
    }),
}));
