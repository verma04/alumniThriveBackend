import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  uuid,
  timestamp,
  boolean,
  varchar,
  pgEnum,
  json,
  primaryKey,
  numeric,
  date,
} from "drizzle-orm/pg-core";
import { organization } from "../tenant";
import { alumniToOrganization } from "./alumni";

export const eventTypesEnum = pgEnum("eventTypes", [
  "virtual",
  "inPerson",
  "hybrid",
]);
export const eventVisibilityEnum = pgEnum("eventVisibility", [
  "private",
  "public",
]);
export const eventCostTypeEnum = pgEnum("eventCostTypeEnum", ["free", "paid"]);
export const paymentModeEnum = pgEnum("paymentMode", [
  "qrCode",
  "paypal",
  "bankAccount",
]);
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventHost: uuid("host_id").notNull(),
  organization: uuid("org_id").notNull(),
  cover: text("cover").notNull().default("defaultEventCover.png"),
  name: text("eventName").notNull(),
  slug: text("slug").notNull().unique(),
  eventType: eventTypesEnum("eventType").notNull(),
  venue: text("venue"),
  registrationEndDate: date("registrationEndDate").notNull(),
  eventStartTime: date("startDate").notNull(),
  eventEndTime: date("endDate").notNull(),
  eventVisibility: eventVisibilityEnum("eventVisibility").notNull(),
  eventDescription: text("eventDescription"),
  isAcceptingSponsorShip: boolean("isAcceptingSponsorShip")
    .notNull()
    .default(false),
  isApproved: boolean("isApproved").notNull().default(false),
  isActive: boolean("isActive").notNull().default(false),
  group: uuid("groupId"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const eventsPayments = pgTable("eventsPayments", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_Id").notNull(),
  eventCost: eventCostTypeEnum("eventCostTypeEnum").notNull(),
  accountNumber: text("accountNumber"),
  bankName: text("bankName"),
  ifscCode: text("ifscCode"),
  paymentMode: paymentModeEnum("paymentMode"),
  currency: text("currency"),
  costPerAdults: numeric("forAdults"),
  costPerChildren: numeric("forChildren"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const eventsSponsorShip = pgTable("eventsSponsorShip", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("eventId").references(() => events.id),
  sponsorType: text("sponsorType"),
  price: numeric("price"),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  eventsPayments: one(eventsPayments),
  sponsorShip: many(eventsSponsorShip),
  eventHost: one(alumniToOrganization, {
    fields: [events.eventHost],
    references: [alumniToOrganization.alumniId],
  }),
  organization: one(organization, {
    fields: [events.organization],
    references: [organization.id],
  }),
}));

export const eventsPaymentsRelations = relations(
  eventsPayments,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventsPayments.eventId],
      references: [events.id],
    }),
  })
);
