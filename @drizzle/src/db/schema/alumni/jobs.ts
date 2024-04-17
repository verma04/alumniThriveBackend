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

export const jobTypeEnum = pgEnum("jobType", [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "internship",
  "volunteer",
  "other",
]);
export const workplaceTypeEnum = pgEnum("workplaceType", [
  "on-Site",
  "hybrid",
  "remote",
]);

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  postedBy: uuid("postedBy_id").notNull(),
  organization: uuid("org_id").notNull(),
  jobTitle: text("jobTitle").notNull(),
  company: text("company").notNull(),
  salary: text("salary").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  jobType: jobTypeEnum("eventType").notNull(),
  workplaceType: workplaceTypeEnum("workplaceType").notNull(),
  isApproved: boolean("isApproved").notNull().default(false),
  isActive: boolean("isActive").notNull().default(false),
  group: uuid("groupId"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  tag: json("tag"),
  experience: text("experience").notNull(),
});

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  group: one(groups, {
    fields: [jobs.id],
    references: [groups.id],
  }),
  postedBy: one(alumniToOrganization, {
    fields: [jobs.id],
    references: [alumniToOrganization.alumniId],
  }),
  jobApplicant: many(jobApplicant),
}));

export const jobApplicant = pgTable(
  "jobApplicant",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    alumni: uuid("alumni_id").notNull(),
    jobId: uuid("jobs_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    fullName: text("fullName").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    resume: text("resume").notNull(),
  },
  (t) => ({
    unq: unique().on(t.alumni, t.jobId),
    unq2: unique("uniqueJobApplicant").on(t.alumni, t.jobId),
  })
);

export const jobApplicantRelations = relations(
  jobApplicant,
  ({ one, many }) => ({
    job: one(jobs, {
      fields: [jobApplicant.jobId],
      references: [jobs.id],
    }),
    alumni: one(alumniToOrganization, {
      fields: [jobApplicant.alumni],
      references: [alumniToOrganization.alumniId],
    }),
  })
);
