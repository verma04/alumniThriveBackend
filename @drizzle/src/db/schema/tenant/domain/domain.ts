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
import { organization } from "../organizationSchema/organization";

export const domain = pgTable("domain", {
  id: uuid("id").defaultRandom().primaryKey(),
  domain: text("domain").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  organizationId: uuid("organization_id"),
});

export const domainRelations = relations(domain, ({ one }) => ({
  author: one(organization, {
    fields: [domain.organizationId],
    references: [organization.id],
  }),
}));
