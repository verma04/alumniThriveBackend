enum type {
  virtual = "virtual",
  inPerson = "inPerson",
  hybrid = "hybrid",
}

enum reactionType {
  like = "like",
  celebrate = "celebrate",
  support = "support",
  love = "love",
  insightful = "insightful",
  funny = "funny",
}
enum visibility {
  private = "private",
  public = "public",
}
enum joiningConditions {
  "anyoneCanJoin",
  "adminOnlyAdd",
}

export interface group {
  name: string;
  privacy: visibility;
  about: string;
  groupType: type;
}
export interface id {
  id: string;
  type: reactionType;
}

export interface addGroupInput {
  input: group;
}

export interface invitationIds {
  id: string[];
  group: string;
}
export interface acceptInvitation {
  group: string;
}

export interface invitationInput {
  input: invitationIds;
}

export interface acceptInvitationInput {
  input: invitationIds;
}

export interface slug {
  slug: string;
}

export interface groupSlug {
  input: slug;
}

export interface feed {
  description: string;
  groupId: string;
  image: [any];
}
export interface groupFeed {
  input: feed;
}

export interface feedLike {
  input: id;
}
export interface request {
  alumniId: string;
  groupID: string;
  accept: boolean;
}

export interface acceptRequestGroup {
  input: request;
}
