import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  pgEnum,
  date,
  json,
  unique,
} from "drizzle-orm/pg-core";

import { groups } from "./groups";
import { alumniToOrganization } from "./alumni";
import { organization } from "../tenant";
export const conditionEnum = pgEnum("conditionEnum", [
  "new",
  "used-like now",
  "used-like good",
  "used-like fair",
]);
export const marketPlace = pgTable("marketPlaceListing", {
  id: uuid("id").defaultRandom().primaryKey(),
  postedBy: uuid("postedBy_id").notNull(),
  organization: uuid("org_id").notNull(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  condition: conditionEnum("condition").notNull(),
  sku: text("sku"),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  // expireDate: date("expireDate"),
  category: uuid("category_id"),
  isApproved: boolean("isApproved").notNull().default(false),
  isActive: boolean("isActive").notNull().default(false),
  isExpired: boolean("isExpired").notNull().default(false),
  // group: uuid("groupId"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  tag: json("tag"),
  currency: text("currency").notNull(),
});

export const marketPlaceRelations = relations(marketPlace, ({ one, many }) => ({
  // group: one(groups, {
  //   fields: [marketPlace.id],
  //   references: [groups.id],
  // }),
  images: many(marketPlaceImages),
  organization: one(organization, {
    fields: [marketPlace.organization],
    references: [organization.id],
  }),
  postedBy: one(alumniToOrganization, {
    fields: [marketPlace.postedBy],
    references: [alumniToOrganization.alumniId],
  }),
  category: one(marketPlaceCategory, {
    fields: [marketPlace.category],
    references: [marketPlaceCategory.id],
  }),
}));

export const marketPlaceCategory = pgTable("marketPlaceCategory", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  organization: uuid("org_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const marketPlaceCategoryRelations = relations(
  marketPlaceCategory,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [marketPlaceCategory.organization],
      references: [organization.id],
    }),
    marketPlace: many(marketPlace),
  })
);

export const marketPlaceImages = pgTable("marketPlaceImages", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  marketPlace: uuid("marketPlace_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const marketPlaceImagesRelation = relations(
  marketPlaceImages,
  ({ one, many }) => ({
    marketPlace: one(marketPlace, {
      fields: [marketPlaceImages.marketPlace],
      references: [marketPlace.id],
    }),
  })
);
