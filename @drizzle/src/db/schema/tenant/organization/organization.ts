import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organization } from "../domain";
// import { organization } from "../admin/admin";

export const subOrganization = pgTable("subOrganization", {
  id: uuid("id").primaryKey(),
  name: text("full_name").notNull(),
  parentOrganization: integer("organization_id"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const subOrganizationRelations = relations(
  subOrganization,
  ({ one }) => ({
    organization: one(organization, {
      fields: [subOrganization.parentOrganization],
      references: [organization.id],
    }),
  })
);

export const subOrganizationManager = pgTable("subOrganizationManager", {
  id: uuid("id").primaryKey(),
  name: text("full_name").notNull(),
  subOrganization_id: uuid("subOrganization_id"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const managerRelations = relations(
  subOrganizationManager,
  ({ one }) => ({
    subOrganization: one(subOrganization, {
      fields: [subOrganizationManager.subOrganization_id],
      references: [subOrganization.id],
    }),
  })
);
