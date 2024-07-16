"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.association = exports.associationType = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.associationType = (0, pg_core_1.pgEnum)('associationType', [
    'Business School',
    'College',
    'University',
    'School',
    'Other',
    'Others',
]);
exports.association = (0, pg_core_1.pgTable)('association', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    associationType: (0, exports.associationType)('associationType').notNull(),
    logo: (0, pg_core_1.text)('logo').notNull(),
    about: (0, pg_core_1.text)('about').notNull(),
});
