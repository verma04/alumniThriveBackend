import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { domain } from "../domain/domain";
import { users } from "../admin";
import {
  alumni,
  alumniToOrganization,
  events,
  groups,
  marketPlace,
  marketPlaceCategory,
} from "../../alumni";

export const organization = pgTable("organization", {
  id: uuid("id").defaultRandom().primaryKey(),
  address: text("address").notNull(),
  category: text("category").notNull(),
  organizationName: text("organizationName").notNull(),
  timeZone: text("timeZone").notNull(),
  logo: text("logo").notNull(),
  website: text("website").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  userId: uuid("user_id"),
  favicon: text("favicon"),
  color: text("color"),
});

export const organizationRelations = relations(
  organization,
  ({ one, many }) => ({
    domain: one(domain),
    razorpay: one(razorpay),
    stripe: one(stripe),
    group: many(groups),
    events: many(events),
    organization: many(alumniToOrganization),
    marketPlaceListing: many(marketPlace),
    marketPlaceListingCategory: many(marketPlaceCategory),
    theme: one(theme),
    user: one(users, {
      fields: [organization.userId],
      references: [users.id],
    }),
  })
);

export const theme = pgTable("theme", {
  id: uuid("id").defaultRandom().primaryKey(),
  colorPrimary: text("colorPrimary").notNull().default("#00b96b"),
  borderRadius: text("borderRadius").notNull().default("2"),
  colorBgContainer: text("colorBgContainer").notNull().default("#f6ffed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  organizationId: uuid("organization_id"),
});

export const themeRelations = relations(theme, ({ one }) => ({
  user: one(organization, {
    fields: [theme.organizationId],
    references: [organization.id],
  }),
}));

export const razorpay = pgTable("razorpay", {
  id: uuid("id").defaultRandom().primaryKey(),
  keyID: text("key_id").unique(),
  keySecret: text("key_secret").unique(),
  organization: uuid("organization_id").notNull(),
  isEnabled: boolean("isEnabled").default(false),
});

export const razorpayRelations = relations(razorpay, ({ one }) => ({
  organization: one(organization, {
    fields: [razorpay.organization],
    references: [organization.id],
  }),
}));

export const stripe = pgTable("stripe ", {
  id: uuid("id").defaultRandom().primaryKey(),
  keyID: text("key_id").unique(),
  keySecret: text("key_secret").unique(),
  organization: uuid("organization_id").notNull(),
  isEnabled: boolean("isEnabled").default(false),
});

export const stripeRelations = relations(stripe, ({ one }) => ({
  organization: one(organization, {
    fields: [stripe.organization],
    references: [organization.id],
  }),
}));
