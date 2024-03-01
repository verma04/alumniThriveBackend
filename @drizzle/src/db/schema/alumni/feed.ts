import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  primaryKey,
  uuid,
  pgEnum,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { alumniToOrganization } from "./alumni";
import { organization } from "../tenant";

export const feedForm = pgEnum("feedForm", ["group"]);

export const alumniFeed = pgTable("alumniFeed", {
  id: uuid("id").defaultRandom().primaryKey(),
  alumniId: uuid("alumni_id").notNull(),
  groupId: uuid("group_id"),
  orgId: uuid("org_id").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  feedForm: feedForm("feedForm").notNull(),
});

export const feedRelations = relations(alumniFeed, ({ one, many }) => ({
  reactions: many(feedReactions),
  media: many(media),
  group: one(groups, {
    fields: [alumniFeed.groupId],
    references: [groups.id],
  }),
  alumni: one(alumniToOrganization, {
    fields: [alumniFeed.alumniId],
    references: [alumniToOrganization.alumniId],
  }),
  organization: one(organization, {
    fields: [alumniFeed.orgId],
    references: [organization.id],
  }),
}));

export const reactionsType = pgEnum("reactionsType", [
  "like",
  "celebrate",
  "support",
  "love",
  "insightful",
  "funny",
]);
export const feedReactions = pgTable(
  "feedReactions",
  {
    alumniId: uuid("alumni_id").notNull(),
    feedId: uuid("feed_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    reactionsType: reactionsType("reactionsType").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.alumniId, table.feedId] }),
      alumniToOrganization: primaryKey({
        name: "alumniOrganization",
        columns: [table.alumniId, table.feedId],
      }),
    };
  }
);

export const feedReactionsRelations = relations(
  feedReactions,
  ({ one, many }) => ({
    feed: one(alumniFeed, {
      fields: [feedReactions.feedId],
      references: [alumniFeed.id],
    }),
    alumni: one(alumniToOrganization, {
      fields: [feedReactions.alumniId],
      references: [alumniToOrganization.alumniId],
    }),
  })
);

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  feedId: uuid("feed_id"),
  meta: json("meta"),
  url: text("url").notNull(),
  organization: uuid("org_id").notNull(),
  alumni: uuid("alumni_id").notNull(),
  groupId: uuid("group_Id"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mediaRelations = relations(media, ({ one, many }) => ({
  feed: one(alumniFeed, {
    fields: [media.feedId],
    references: [alumniFeed.id],
  }),
  group: one(groups, {
    fields: [media.groupId],
    references: [groups.id],
  }),
  organization: one(organization, {
    fields: [media.organization],
    references: [organization.id],
  }),
  alumni: one(alumniToOrganization, {
    fields: [media.alumni],
    references: [alumniToOrganization.alumniId],
  }),
}));
