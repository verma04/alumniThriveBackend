import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  pgEnum,
  numeric,
  boolean,
  json,
  timestamp,
  date,
  time,
} from "drizzle-orm/pg-core";
import { alumniToOrganization } from "./alumni";
import { organization } from "../tenant";

export const alumniStoryCategory = pgTable("alumniStoryCategory", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  organization: uuid("org_id").notNull(),
});
export const alumniStoryCategoryRelations = relations(
  alumniStoryCategory,
  ({ one, many }) => ({
    alumniStory: many(alumniStory),
    organization: one(organization, {
      fields: [alumniStoryCategory.organization],
      references: [organization.id],
    }),
  })
);
export const alumniStory = pgTable("alumniStory", {
  id: uuid("id").defaultRandom().primaryKey(),
  user: uuid("alumni_id").notNull(),
  category: uuid("category").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  cover: text("cover").notNull(),
  organization: uuid("org_id").notNull(),
  slug: text("slug").notNull().unique(),
  isApproved: boolean("isApproved").notNull(),
  shortDescription: text("shortDescription").notNull(),
  description: text("description").notNull(),
});

export const alumniStoryRelations = relations(alumniStory, ({ one, many }) => ({
  user: one(alumniToOrganization, {
    fields: [alumniStory.user],
    references: [alumniToOrganization.alumniId],
  }),
  category: one(alumniStoryCategory, {
    fields: [alumniStory.category],
    references: [alumniStoryCategory.id],
  }),
  organization: one(organization, {
    fields: [alumniStory.organization],
    references: [organization.id],
  }),
}));
