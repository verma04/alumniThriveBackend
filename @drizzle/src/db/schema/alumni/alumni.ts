import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  varchar,
  pgEnum,
  json,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { organization } from "../tenant";
import { events, eventsAttendees } from "./events";
import { groupInvitation, groupRequest, groups, groupMember } from "./groups";
import { feedReactions } from "./feed";
import { marketPlace } from "./marketPlace";

export const loginTypeEnum = pgEnum("loginType", [
  "email",
  "google",
  "linkedin",
]);
export const alumni = pgTable("alumni", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("firstName").notNull(),
  avatar: text("avatar"),
  lastName: text("lastName").notNull(),
  email: text("email").notNull().unique(),
  loginType: loginTypeEnum("loginType").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  googleId: text("googleId"),
});
export const alumniRelations = relations(alumni, ({ one, many }) => ({
  profileInfo: one(alumniProfile),
  aboutAlumni: one(aboutAlumni),
  alumni: many(alumniToOrganization),
  resume: many(alumniToOrganization),
}));

export const alumniProfile = pgTable("alumniProfile", {
  id: uuid("id").defaultRandom().primaryKey(),
  country: text("country"),
  language: text("designation"),
  DOB: text("DOB"),
  alumniId: uuid("alumni_ID").notNull(),
  experience: json("experience"),
  education: json("education"),
  phone: json("phone"),
});
export const aboutAlumni = pgTable("aboutAlumni", {
  about: text("about"),
  id: uuid("id").defaultRandom().primaryKey(),
  currentPosition: text("currentPosition"),
  linkedin: text("linkedin"),
  instagram: text("instagram"),
  portfolio: text("portfolio"),
  alumniId: uuid("alumni_ID").notNull(),
});

export const alumniResume = pgTable("alumniResume", {
  currentPosition: text("currentPosition"),
  alumniId: uuid("alumni_ID").notNull(),
});

export const alumniProfileRelations = relations(alumniProfile, ({ one }) => ({
  user: one(alumni, {
    fields: [alumniProfile.alumniId],
    references: [alumni.id],
  }),
}));
export const aboutAlumniRelations = relations(aboutAlumni, ({ one }) => ({
  user: one(alumni, {
    fields: [aboutAlumni.alumniId],
    references: [alumni.id],
  }),
}));
export const alumniResumeRelations = relations(alumniResume, ({ one }) => ({
  user: one(alumni, {
    fields: [alumniResume.alumniId],
    references: [alumni.id],
  }),
}));

export const alumniToOrganization = pgTable(
  "alumniOrganizationProfile",
  {
    alumniId: uuid("alumni_id"),
    organizationId: uuid("organization_id"),
    isApproved: boolean("isApproved").notNull().default(false),
    isRequested: boolean("isRequested").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.organizationId, table.alumniId] }),
      alumniToOrganization: primaryKey({
        name: "alumniOrganization",
        columns: [table.organizationId, table.alumniId],
      }),
    };
  }
);

export const alumniToOrganizationRelations = relations(
  alumniToOrganization,
  ({ one, many }) => ({
    relations: many(feedReactions),
    group: many(groups),
    alumniKyc: one(alumniKyc),
    events: many(events),
    groupMember: many(groupMember),
    groupInvitation: many(groupInvitation),
    groupRequest: many(groupRequest),
    eventsAttendees: many(eventsAttendees),
    marketPlaceListing: many(marketPlace),
    followers: many(alumniConnection, {
      relationName: "followers",
    }),
    following: many(alumniConnection, {
      relationName: "following",
    }),
    requestSent: many(alumniRequest, {
      relationName: "requestSent",
    }),
    requestReceive: many(alumniRequest, {
      relationName: "requestReceive",
    }),

    alumni: one(alumni, {
      fields: [alumniToOrganization.alumniId],
      references: [alumni.id],
    }),
    organization: one(organization, {
      fields: [alumniToOrganization.alumniId],
      references: [organization.id],
    }),
  })
);

export const alumniKyc = pgTable("alumniKyc", {
  id: uuid("id").defaultRandom().primaryKey(),
  affliction: json("affliction"),
  referralSource: json("referralSource"),
  comment: json("comment").notNull(),
  agreement: boolean("agreement").notNull(),
  orgId: uuid("orgId").notNull(),
});

export const alumniKycRelations = relations(alumniKyc, ({ one, many }) => ({
  alumni: one(alumniToOrganization, {
    fields: [alumniKyc.orgId],
    references: [alumniToOrganization.alumniId],
  }),
}));

export const alumniConnection = pgTable(
  "alumniConnection",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    followingId: uuid("alumni_id").notNull(),
    followerId: uuid("followers_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    isAccepted: boolean("isAccepted").notNull(),
  },
  (table) => {
    return {
      unq: unique().on(table.followingId, table.followerId),
      unq2: unique("alumniConnection").on(table.followingId, table.followerId),
    };
  }
);

export const alumniConnectionRelations = relations(
  alumniConnection,
  ({ one, many }) => ({
    following: one(alumniToOrganization, {
      fields: [alumniConnection.followingId],
      references: [alumniToOrganization.alumniId],
      relationName: "following",
    }),
    followers: one(alumniToOrganization, {
      fields: [alumniConnection.followerId],
      references: [alumniToOrganization.alumniId],
      relationName: "followers",
    }),
  })
);

export const alumniRequest = pgTable(
  "alumniConnectionRequest",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    senderId: uuid("sender_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    isAccepted: boolean("isAccepted").notNull(),
  },
  (table) => {
    return {
      unq: unique().on(table.userId, table.senderId),
      unq2: unique("alumniRequest").on(table.userId, table.senderId),
    };
  }
);

export const alumniRequestRelations = relations(
  alumniRequest,
  ({ one, many }) => ({
    user: one(alumniToOrganization, {
      fields: [alumniRequest.userId],
      references: [alumniToOrganization.alumniId],
      relationName: "requestSent",
    }),
    sender: one(alumniToOrganization, {
      fields: [alumniRequest.senderId],
      references: [alumniToOrganization.alumniId],
      relationName: "requestReceive",
    }),
  })
);
