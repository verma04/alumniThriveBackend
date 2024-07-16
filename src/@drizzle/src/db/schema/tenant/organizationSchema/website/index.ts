import { relations, sql } from 'drizzle-orm'
import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core'
import { organization } from '../organization'

export const homePageCarousel = pgTable('homeCarousel', {
    id: uuid('id').defaultRandom().primaryKey(),
    url: text('url'),
    image: text('image').notNull(),
    organization: uuid('organization_id'),
})

export const homePageCarouselRelations = relations(
    homePageCarousel,
    ({ one, many }) => ({
        organization: one(organization, {
            fields: [homePageCarousel.organization],
            references: [organization.id],
        }),
    })
)
