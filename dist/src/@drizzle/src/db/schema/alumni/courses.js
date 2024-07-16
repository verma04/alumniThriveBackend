"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRequestRelations = exports.courseRequest = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const alumni_1 = require("./alumni");
exports.courseRequest = (0, pg_core_1.pgTable)('courseRequest', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    email: (0, pg_core_1.text)('email').notNull(),
    fullName: (0, pg_core_1.text)('fullName').notNull(),
    contactNumber: (0, pg_core_1.text)('contactNumber').notNull(),
    describes: (0, pg_core_1.text)('email').notNull(),
    youTubeChannel: (0, pg_core_1.text)('youTubeChannel'),
    platformDoYouSellCourses: (0, pg_core_1.text)(' platformDoYouSellCourses'),
    readyCourses: (0, pg_core_1.text)('readyCourses'),
    averageStudent: (0, pg_core_1.text)('readyCourses').notNull(),
    user: (0, pg_core_1.uuid)('user_id').notNull(),
});
exports.courseRequestRelations = (0, drizzle_orm_1.relations)(exports.courseRequest, ({ one, many }) => ({
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.courseRequest.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
}));
