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
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { alumni, alumniToOrganization } from "./alumni";
import { organization } from "../tenant";
import { alumniFeed } from "./feed";
import { events } from "./events";

export const privacyEnum = pgEnum("privacy", ["private", "public"]);

export const groupTypeEnum = pgEnum("groupType", [
  "virtual",
  "hybrid",
  "inPerson",
]);

export const managerRole = pgEnum("managerRole", ["admin", "manager", "user"]);
export const userAddedForm = pgEnum("userAddedForm", ["invite", "direct"]);
export const joiningConditionsEnum = pgEnum("joiningConditions", [
  "Anyone Can Join",
  "Admin only Add",
]);
export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name"),
  creator: uuid("creator_id"),
  organization: uuid("org_id").notNull(),
  cover: text("cover").default("/groups-default-cover-photo.jpg"),
  avatar: text("avatar").default("/groups-default-cover-photo.jpg"),
  isApproved: boolean("isApproved").notNull().default(false),
  isPaused: boolean("isPaused").notNull().default(false),
  isActive: boolean("isActive").notNull().default(false),
  about: text("about"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const groupRelations = relations(groups, ({ one, many }) => ({
  setting: one(groupsSetting),
  groupMember: many(groupMember),
  events: many(events),
  groupInvitation: many(groupInvitation),
  groupRequest: many(groupRequest),
  creator: one(alumniToOrganization, {
    fields: [groups.creator],
    references: [alumniToOrganization.alumniId],
  }),
  organization: one(organization, {
    fields: [groups.organization],
    references: [organization.id],
  }),
}));

export const groupMember = pgTable(
  "users_to_groups",
  {
    alumniId: uuid("alumni_id").notNull(),
    groupId: uuid("group_id").notNull(),
    role: managerRole("managerRole").default("user"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    userAddedForm: userAddedForm("userAddedForm"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.alumniId, table.groupId] }),
      alumniToOrganization: primaryKey({
        name: "alumniOrganization",
        columns: [table.alumniId, table.groupId],
      }),
    };
  }
);

export const groupToUserRelations = relations(groupMember, ({ one, many }) => ({
  groupId: one(groups, {
    fields: [groupMember.groupId],
    references: [groups.id],
  }),
  alumni: one(alumniToOrganization, {
    fields: [groupMember.alumniId],
    references: [alumniToOrganization.alumniId],
  }),
}));

export const groupsSetting = pgTable("groupsSetting", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").notNull(),
  groupType: groupTypeEnum("groupType").notNull().default("virtual"),
  joiningConditions:
    joiningConditionsEnum("joiningConditions").default("Anyone Can Join"),
  privacy: privacyEnum("privacy").default("public"),
});

export const groupsSettingRelations = relations(groupsSetting, ({ one }) => ({
  alumni: one(groups, {
    fields: [groupsSetting.groupId],
    references: [groups.id],
  }),
}));

export const groupInvitation = pgTable(
  "groupInvitation",
  {
    alumniId: uuid("alumni_id").notNull(),
    groupId: uuid("group_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    isAccepted: boolean("isAccepted").default(false),
    actionTime: timestamp("actionTime"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.alumniId, table.groupId] }),
      alumniToOrganization: primaryKey({
        name: "alumniOrganization",
        columns: [table.alumniId, table.groupId],
      }),
    };
  }
);

export const invitationRelations = relations(
  groupInvitation,
  ({ one, many }) => ({
    groupId: one(groups, {
      fields: [groupInvitation.groupId],
      references: [groups.id],
    }),
    alumniId: one(alumniToOrganization, {
      fields: [groupInvitation.alumniId],
      references: [alumniToOrganization.alumniId],
    }),
  })
);

export const groupRequest = pgTable(
  "groupRequest",
  {
    alumniId: uuid("alumni_id").notNull(),
    groupId: uuid("group_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    isAccepted: boolean("isAccepted").default(false),
    // acceptedBy: uuid("acceptedBy"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.alumniId, table.groupId] }),
      alumniToOrganization: primaryKey({
        name: "groupRequest",
        columns: [table.alumniId, table.groupId],
      }),
    };
  }
);

export const groupRequestRelations = relations(
  groupRequest,
  ({ one, many }) => ({
    groupId: one(groups, {
      fields: [groupRequest.groupId],
      references: [groups.id],
    }),
    alumni: one(alumniToOrganization, {
      fields: [groupRequest.alumniId],
      references: [alumniToOrganization.alumniId],
    }),
    // acceptedBy: one(alumniToOrganization, {
    //   fields: [groupRequest.acceptedBy],
    //   references: [alumniToOrganization.alumniId],
    // }),
  })
);
