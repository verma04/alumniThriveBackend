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
// import { domain } from "../domain/domain";
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
//   organizationId: text("organization_id")
//     .notNull()
//     .references(() => organization.id),
// });

// export const organization = pgTable("organization", {
//   id: serial("id").primaryKey(),
//   name: text("full_name").notNull(),
//   createdAt: timestamp("created_at"),
//   updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// });

// export const userRelations = relations(organization, ({ one, many }) => ({
//   profile: one(admin, {
//     fields: [organization.id],
//     references: [admin.organizationId],
//   }),
// }));

// export const tenantRelations = relations(organization, ({ one, many }) => ({
//   profileInfo: one(domain),
// }));

import { pgTable, serial, text, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const usersRelations = relations(users, ({ one }) => ({
  profileInfo: one(profileInfo),
}));

export const profileInfo = pgTable("profile_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  metadata: jsonb("metadata"),
});
