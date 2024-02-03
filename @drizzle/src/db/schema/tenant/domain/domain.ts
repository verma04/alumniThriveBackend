// import { relations, sql } from "drizzle-orm";
// import {
//   integer,
//   pgTable,
//   serial,
//   text,
//   timestamp,
//   uuid,
//   varchar,
// } from "drizzle-orm/pg-core";

// import { subOrganization } from "../organization/organization";

// export const admin = pgTable("admin", {
//   id: serial("id").primaryKey(),
//   firstName: text("full_name").notNull(),
//   lastName: text("full_name").notNull(),
//   phone: varchar("phone", { length: 256 }),
//   password: text("full_name").notNull(),
//   email: text("full_name").notNull(),
//   createdAt: timestamp("created_at"),
//   updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// });

// export const adminRelations = relations(admin, ({ one }) => ({
//   organization: one(organization),
// }));

// export const organization = pgTable("organization", {
//   id: serial("id").primaryKey(),
//   name: text("full_name").notNull(),
//   createdAt: timestamp("created_at"),
//   updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
//   adminId: integer("user_id").references(() => admin.id),
// });

import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  uuid,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { subOrganization } from "../organization";

export const user = pgTable("admin", {
  id: uuid("id").primaryKey(),
  firstName: text("full_name").notNull(),
  lastName: text("full_name").notNull(),
  phone: varchar("phone", { length: 256 }),
  password: text("full_name").notNull(),
  email: text("full_name").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(user, ({ one, many }) => ({
  organizationID: one(organization),
  posts: many(subOrganization),
}));

export const organization = pgTable("organization", {
  id: serial("id").primaryKey(),
  name: text("full_name").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  userId: integer("user_id").references(() => user.id),
});
