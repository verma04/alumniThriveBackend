"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homePageCarouselRelations = exports.homePageCarousel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const organization_1 = require("../organization");
exports.homePageCarousel = (0, pg_core_1.pgTable)('homeCarousel', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    url: (0, pg_core_1.text)('url'),
    image: (0, pg_core_1.text)('image').notNull(),
    organization: (0, pg_core_1.uuid)('organization_id'),
});
exports.homePageCarouselRelations = (0, drizzle_orm_1.relations)(exports.homePageCarousel, ({ one, many }) => ({
    organization: one(organization_1.organization, {
        fields: [exports.homePageCarousel.organization],
        references: [organization_1.organization.id],
    }),
}));
