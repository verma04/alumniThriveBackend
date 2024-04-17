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
  unique,
} from "drizzle-orm/pg-core";

export const associationType = pgEnum("associationType", [
  "Business School",
  "College",
  "University",
  "School",
  "Other",
  "Others",
]);

export const association = pgTable("association", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  associationType: associationType("associationType").notNull(),
  logo: text("logo").notNull(),
  about: text("about").notNull(),
});
