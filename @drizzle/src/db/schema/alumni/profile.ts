import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { alumniProfile } from "./alumni";
import { varchar } from "drizzle-orm/mysql-core";

export const alumni = pgTable("alumni", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("name").notNull(),
  password: text("password"),
});

export const usersRelations = relations(alumni, ({ one }) => ({
  profileInfo: one(alumniProfile),
}));
