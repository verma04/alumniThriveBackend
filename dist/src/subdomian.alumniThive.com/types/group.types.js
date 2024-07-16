"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const groupTypes = (0, apollo_server_core_1.gql) `
    scalar Upload
    scalar Date

    type success {
        success: Boolean
    }

    type group {
        title: String
        cover: String
        id: ID
        slug: String
        total: Int
        about: String
        admin: user
        privacy: String
        groupMember: [groupMember]
        isGroupMember: Boolean
        isJoinRequest: Boolean
        isGroupAdmin: Boolean
        isTrending: Boolean
        numberOfUser: Int
        numberOfLikes: Int
        numberOfPost: Int
        groupSettings: groupSettings
        numberOfViews: Int
        tag: [String]
        isFeatured: Boolean
    }

    type groupSettings {
        groupType: String
        joiningCondition: String
        privacy: String
    }
    type aboutAlumni {
        currentPosition: String
    }

    type allGroup {
        totalRecords: Int
        data: [group]
    }

    type alumni {
        id: ID
        firstName: String
        lastName: String
        memberSince: Date
        aboutAlumni: aboutAlumni
        role: String
        avatar: String
    }
    input slug {
        slug: String!
    }
    input typeid {
        id: ID!
        offset: Int
    }
    type groupMember {
        id: ID
        role: String
        createdAt: Date
        user: alumni
    }
    input request {
        alumniId: String
        groupID: String
        accept: Boolean
    }

    input inputGetGroup {
        sort: String
        theme: [String]
        interests: [String]
        search: String
        mode: String
        privacy: String
        offset: Int
        limit: Int
    }

    type theme {
        id: ID
        title: String
    }

    type Query {
        getYourGroup(input: inputGetGroup): allGroup
        getFeaturedGroup(input: inputGetGroup): allGroup
        getGroupBySlug(input: slug!): group
        getGroupBySlugPeople(input: slug!): [alumni]
        getGroupFeed(input: typeid!): [feed]
        getAllAlumniFeed(input: typeid!): [feed]
        getAllUserFeed: [feed]
        getAllGroupPeople(input: typeid!): [groupMember]
        getAllGroupRequest(input: typeid!): [groupMember]
        getAllGroupEvents(input: typeid!): [event]
        getGroupTheme: [theme]
        getGroupInterests: [theme]
        getGroupModeType: [String]
        getGroupPrivacyEnum: [String]
        getGroupsRecommendation: [group]
    }
    type reactions {
        type: String
        user: alumni
        feedId: ID
    }

    enum privacy {
        private
        public
    }
    enum joiningConditions {
        anyoneCanJoin
        adminOnlyAdd
    }

    input addGroup {
        name: String!
        privacy: privacy!
        about: String!
        groupType: String!
        cover: Upload
        joiningCondition: String!
        theme: ID
        interest: ID
        tag: [String]
    }
    input invitation {
        id: [String]!
        group: String!
    }
    input likeFeed {
        id: ID!
        type: String!
    }
    input acceptInvitation {
        group: String!
    }
    input groupFeed {
        description: String!
        groupId: String!
        image: [Upload]
    }
    type feed {
        id: ID
        description: String
        user: alumni
        createdAt: Date
        group: group
        reactions: [reactions]
        media: [media]
        feedForm: String
        job: String
    }
    type joinGroup {
        id: ID
        isGroupMember: Boolean
        isJoinRequest: Boolean
    }

    type Mutation {
        createGroup(input: addGroup): [group]
        inviteMember(input: invitation): success
        acceptInvitation(input: acceptInvitation): success
        leaveGroup(input: acceptInvitation): success
        joinGroup(input: acceptInvitation): joinGroup
        addFeedGroup(input: groupFeed): feed
        likeFeed(input: likeFeed): reactions
        acceptRequestGroup(input: request): groupMember
    }
`;
exports.groupTypes = groupTypes;
