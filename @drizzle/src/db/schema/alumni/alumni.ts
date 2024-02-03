import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { alumni } from "./profile";

export const alumniProfile = pgTable("alumni_profile", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => alumni.id),
  metadata: jsonb("metadata"),
});
