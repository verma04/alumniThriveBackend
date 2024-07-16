"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const schema_1 = require("../../../@drizzle/src/db/schema");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const slugify_1 = __importDefault(require("slugify"));
const graphql_1 = require("graphql");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const upload_utils_1 = __importDefault(require("../../utils/upload/upload.utils"));
const approveGroup_queue_1 = __importDefault(require("../../../queue/approveGroup.queue"));
const groupConditions = (org_id, search, theme, interests, mode, privacy) => {
    const conditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id), (0, drizzle_orm_1.eq)(schema_1.groups.isApproved, true), (0, drizzle_orm_1.and)(!search || search?.length === 0
        ? (0, drizzle_orm_1.not)((0, drizzle_orm_1.ilike)(schema_1.groups.title, `%${null}%`))
        : (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.groups.title, `%${search}%`), (0, drizzle_orm_1.ilike)(schema_1.groups.about, `%${search}%`)), !theme || theme.length === 0
        ? (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id)
        : (0, drizzle_orm_1.inArray)(schema_1.groupTheme.title, theme), !interests || interests.length === 0
        ? (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id)
        : (0, drizzle_orm_1.inArray)(schema_1.groupInterests.title, interests), mode
        ? (0, drizzle_orm_1.eq)(schema_1.groupsSetting.groupType, mode)
        : (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id), privacy
        ? (0, drizzle_orm_1.eq)(schema_1.groupsSetting.privacy, privacy)
        : (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id)));
    return conditions;
};
const groupConditionsFeatured = (org_id, search, theme, interests, mode, privacy) => {
    const conditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id), (0, drizzle_orm_1.eq)(schema_1.groups.isApproved, true), (0, drizzle_orm_1.eq)(schema_1.groups.isFeatured, true), (0, drizzle_orm_1.and)(!search || search?.length === 0
        ? (0, drizzle_orm_1.not)((0, drizzle_orm_1.ilike)(schema_1.groups.title, `%${null}%`))
        : (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.groups.title, `%${search}%`), (0, drizzle_orm_1.ilike)(schema_1.groups.about, `%${search}%`)), !theme || theme.length === 0
        ? (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id)
        : (0, drizzle_orm_1.inArray)(schema_1.groupTheme.title, theme), !interests || interests.length === 0
        ? (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id)
        : (0, drizzle_orm_1.inArray)(schema_1.groupInterests.title, interests), mode
        ? (0, drizzle_orm_1.eq)(schema_1.groupsSetting.groupType, mode)
        : (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id), privacy
        ? (0, drizzle_orm_1.eq)(schema_1.groupsSetting.privacy, privacy)
        : (0, drizzle_orm_1.eq)(schema_1.groups.organization, org_id)));
    return conditions;
};
const groupView = async ({ id, group }) => {
    const checkView = await _drizzle_1.db.query.groupViews.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupViews.user, id), (0, drizzle_orm_1.eq)(schema_1.groupViews.group, group.id)),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    if (checkView) {
        //@ts-ignore
        const hours = Math.abs(Date.now() - checkView.createdAt) / 36e5;
        if (hours >= 1) {
            await _drizzle_1.db.insert(schema_1.groupViews).values({
                user: id,
                group: group.id,
            });
            await _drizzle_1.db
                .update(schema_1.groups)
                .set({ numberOfViews: group.numberOfViews + 1 })
                .where((0, drizzle_orm_1.eq)(schema_1.groups.id, group.id));
        }
    }
    else {
        await _drizzle_1.db.insert(schema_1.groupViews).values({
            user: id,
            group: group.id,
        });
        await _drizzle_1.db
            .update(schema_1.groups)
            .set({ numberOfViews: group.numberOfViews + 1 })
            .where((0, drizzle_orm_1.eq)(schema_1.groups.id, group.id));
    }
};
const groupResolvers = {
    Query: {
        async getGroupTheme(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const interests = await _drizzle_1.db.query.groupTheme.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupTheme.organization, org_id)),
                });
                return interests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getGroupInterests(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const interests = await _drizzle_1.db.query.groupInterests.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupInterests.organization, org_id)),
                });
                return interests;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getGroupModeType(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                return schema_1.groupTypeEnum?.enumValues;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getGroupPrivacyEnum(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                return schema_1.privacyEnum?.enumValues;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getYourGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const { search, theme, interests, mode, offset, limit, privacy, sort, } = input;
                const conditions = groupConditions(org_id, search, theme, interests, mode, privacy);
                const totalRecords = await _drizzle_1.db
                    .select({ count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number) })
                    .from(schema_1.groups)
                    .leftJoin(schema_1.groupTheme, (0, drizzle_orm_1.eq)(schema_1.groups.theme, schema_1.groupTheme.id))
                    .leftJoin(schema_1.groupsSetting, (0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupsSetting.groupId))
                    .where(conditions);
                const paginatedData = await _drizzle_1.db
                    .select({
                    group: schema_1.groups,
                    groupMember: schema_1.groupMember,
                    groupRequest: schema_1.groupRequest,
                    groupsSetting: schema_1.groupsSetting,
                    trending: schema_1.groups.numberOfViews,
                })
                    .from(schema_1.groups)
                    .leftJoin(schema_1.groupTheme, (0, drizzle_orm_1.eq)(schema_1.groups.theme, schema_1.groupTheme.id))
                    .fullJoin(schema_1.groupMember, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupMember.groupId), (0, drizzle_orm_1.eq)(id, schema_1.groupMember.alumniId)))
                    .fullJoin(schema_1.groupRequest, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupRequest.groupId), (0, drizzle_orm_1.eq)(id, schema_1.groupRequest.alumniId)))
                    .leftJoin(schema_1.groupsSetting, (0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupsSetting.groupId))
                    .leftJoin(schema_1.groupInterests, (0, drizzle_orm_1.eq)(schema_1.groups.interest, schema_1.groupInterests.id))
                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(9)
                    .orderBy(sort === 'popular' && (0, drizzle_orm_1.desc)(schema_1.groups.numberOfPost), sort === 'viewed' && (0, drizzle_orm_1.desc)(schema_1.groups.numberOfViews), !sort && (0, drizzle_orm_1.desc)(schema_1.groups.createdAt));
                const topTrending = paginatedData
                    .sort((a, b) => b.trending - a.trending)
                    .slice(0, 5);
                return {
                    totalRecords: totalRecords[0].count,
                    data: paginatedData.map((set) => ({
                        ...set?.group,
                        isGroupMember: set.groupMember ? true : false,
                        isJoinRequest: set.groupRequest ? true : false,
                        groupSettings: set.groupsSetting,
                        isTrending: topTrending.includes(set),
                    })),
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getGroupsRecommendation(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await _drizzle_1.db.query.alumniToOrganization.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, id), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.organizationId, org_id)),
                });
                const data = await _drizzle_1.db
                    .select({
                    // views: count(groupViews.id),
                    group: schema_1.groups,
                    groupMember: schema_1.groupMember,
                    groupRequest: schema_1.groupRequest,
                    groupsSetting: schema_1.groupsSetting,
                })
                    .from(schema_1.groups)
                    // .leftJoin(groupTheme, eq(groups.theme, groupTheme.id))
                    .leftJoin(schema_1.groupViews, (0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupViews.group))
                    .leftJoin(schema_1.groupMember, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupMember.groupId), (0, drizzle_orm_1.eq)(id, schema_1.groupMember.alumniId)))
                    .leftJoin(schema_1.groupRequest, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupRequest.groupId), (0, drizzle_orm_1.eq)(id, schema_1.groupRequest.alumniId)))
                    .where((0, drizzle_orm_1.arrayOverlaps)(schema_1.groups.tag, user.tag))
                    .leftJoin(schema_1.groupsSetting, (0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupsSetting.groupId))
                    .leftJoin(schema_1.groupInterests, (0, drizzle_orm_1.eq)(schema_1.groups.interest, schema_1.groupInterests.id))
                    .limit(5);
                const re = data.map((set) => ({
                    ...set?.group,
                    isGroupMember: set.groupMember ? true : false,
                    isJoinRequest: set.groupRequest ? true : false,
                    groupSettings: set.groupsSetting,
                }));
                return re;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getFeaturedGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log('dssd');
                const { search, theme, interests, mode, offset, limit, privacy, } = input;
                const isTrending = await _drizzle_1.db.query.trendingConditionsGroups.findFirst({
                    where: (trendingConditionsGroups, { eq }) => eq(trendingConditionsGroups.organization, org_id),
                });
                console.log(isTrending);
                const conditions = groupConditionsFeatured(org_id, search, theme, interests, mode, privacy);
                const totalRecords = await _drizzle_1.db
                    .select({ count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number) })
                    .from(schema_1.groups)
                    .leftJoin(schema_1.groupTheme, (0, drizzle_orm_1.eq)(schema_1.groups.theme, schema_1.groupTheme.id))
                    .leftJoin(schema_1.groupsSetting, (0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupsSetting.groupId))
                    .where(conditions);
                const paginatedData = await _drizzle_1.db
                    .select({
                    group: schema_1.groups,
                    groupMember: schema_1.groupMember,
                    groupRequest: schema_1.groupRequest,
                    groupsSetting: schema_1.groupsSetting,
                })
                    .from(schema_1.groups)
                    .leftJoin(schema_1.groupTheme, (0, drizzle_orm_1.eq)(schema_1.groups.theme, schema_1.groupTheme.id))
                    .fullJoin(schema_1.groupMember, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupMember.groupId), (0, drizzle_orm_1.eq)(id, schema_1.groupMember.alumniId)))
                    .fullJoin(schema_1.groupRequest, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupRequest.groupId), (0, drizzle_orm_1.eq)(id, schema_1.groupRequest.alumniId)))
                    .leftJoin(schema_1.groupsSetting, (0, drizzle_orm_1.eq)(schema_1.groups.id, schema_1.groupsSetting.groupId))
                    .leftJoin(schema_1.groupInterests, (0, drizzle_orm_1.eq)(schema_1.groups.interest, schema_1.groupInterests.id))
                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(9)
                    .orderBy(isTrending.views && (0, drizzle_orm_1.desc)(schema_1.groups.numberOfViews), isTrending.user && (0, drizzle_orm_1.desc)(schema_1.groups.numberOfUser), isTrending.discussion && (0, drizzle_orm_1.desc)(schema_1.groups.numberOfPost));
                return {
                    totalRecords: totalRecords[0].count,
                    data: paginatedData.map((set) => ({
                        ...set?.group,
                        isGroupMember: set.groupMember ? true : false,
                        isJoinRequest: set.groupRequest ? true : false,
                        groupSettings: set.groupsSetting,
                    })),
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getGroupBySlug(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const { slug } = await input;
                const find = await _drizzle_1.db.query.groups.findFirst({
                    where: (d, { eq }) => (0, drizzle_orm_1.and)(eq(d.slug, slug), eq(d.organization, org_id), eq(d.isApproved, true)),
                    with: {
                        setting: true,
                        request: true,
                        member: {
                            with: {
                                alumni: {
                                    with: {
                                        alumni: {
                                            with: {
                                                aboutAlumni: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (find) {
                    const isJoinRequest = await find?.request.some((e) => e?.alumniId === id);
                    const isGroupMember = await find?.member.some((e) => e?.alumniId === id);
                    const isGroupAdmin = await find?.member.some((e) => e?.alumniId === id && e.role === 'admin');
                    groupView({ id, group: find });
                    return {
                        ...find,
                        privacy: find?.setting?.privacy,
                        isGroupMember,
                        isGroupAdmin,
                        isJoinRequest,
                        groupMember: find?.member?.map((t) => ({
                            id: t?.alumniId,
                            role: t?.role,
                            user: {
                                ...t?.alumni?.alumni,
                                aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
                            },
                        })),
                    };
                }
                else {
                    throw new graphql_1.GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getGroupBySlugPeople(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const { slug } = input;
                const find = await _drizzle_1.db.query.groups.findFirst({
                    where: (d, { eq }) => eq(d.slug, slug),
                    with: {
                        setting: true,
                        member: {
                            with: {
                                alumni: {
                                    with: {
                                        alumni: {
                                            with: {
                                                aboutAlumni: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                const data = await find.member.map((set) => ({
                    ...set?.alumni?.alumni,
                    role: set.role,
                    memberSince: set.createdAt,
                }));
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllGroupPeople(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.groupMember.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMember.groupId, input.id)),
                    with: {
                        alumni: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return find.map((t) => ({
                    id: t?.alumniId,
                    role: t?.role,
                    user: {
                        ...t?.alumni?.alumni,
                        aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
                    },
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllGroupRequest(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.groupRequest.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupRequest.groupId, input.id), (0, drizzle_orm_1.eq)(schema_1.groupRequest.isAccepted, false)),
                    with: {
                        alumni: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return find.map((t) => ({
                    id: t.alumniId,
                    createdAt: t.createdAt,
                    user: {
                        ...t?.alumni?.alumni,
                        aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
                    },
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllGroupEvents(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input);
                const find = await _drizzle_1.db.query.events.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.group, input.id)),
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    with: {
                        eventsPayments: true,
                        eventCreator: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return find.map((t) => ({
                    ...t,
                    eventCreator: {
                        ...t?.eventCreator?.alumni,
                        aboutAlumni: t?.eventCreator?.alumni?.aboutAlumni,
                    },
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async createGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input);
                const settings = await _drizzle_1.db.query.organizationSettingsGroups.findFirst({
                    where: (organizationSettingsGroups, { eq }) => eq(organizationSettingsGroups.organization, org_id),
                });
                const { name, privacy, about, groupType, joiningCondition, theme, interest, tag, } = input;
                let cover;
                if (input?.cover) {
                    cover = await (0, upload_utils_1.default)(input.cover);
                }
                let slug = (0, slugify_1.default)(name, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                });
                const find = await _drizzle_1.db.query.groups.findMany({
                    where: (group, { eq }) => eq(group.slug, slug),
                });
                if (find) {
                    const val = Math.floor(1000 + Math.random() * 9000);
                    slug = slug + '-' + val;
                }
                const createGroup = await _drizzle_1.db
                    .insert(schema_1.groups)
                    .values({
                    cover: cover
                        ? cover
                        : 'communities-default-cover-photo.jpg',
                    slug,
                    title: name,
                    creator: id,
                    organization: org_id,
                    about,
                    isApproved: settings.autoApprove,
                    theme,
                    interest,
                    numberOfUser: 1,
                    tag,
                })
                    .returning();
                await _drizzle_1.db.insert(schema_1.groupsSetting).values({
                    joiningCondition: joiningCondition,
                    privacy: privacy,
                    groupId: createGroup[0].id,
                    groupType: groupType,
                });
                await _drizzle_1.db.insert(schema_1.groupMember).values({
                    alumniId: id,
                    groupId: createGroup[0].id,
                    role: 'admin',
                });
                if (createGroup[0].isApproved) {
                    (0, approveGroup_queue_1.default)(id, org_id, createGroup[0]);
                }
                return createGroup;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async inviteMember(_, { input }, context) {
            try {
                const find = await _drizzle_1.db.query.groups.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.groups.slug, input.group),
                });
                if (!find) {
                    throw new graphql_1.GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const request = input.id.map((t) => ({
                    alumniId: t,
                    groupId: find.id,
                    isAccepted: false,
                }));
                const createInvitation = await _drizzle_1.db
                    .insert(schema_1.groupInvitation)
                    .values(request);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async acceptInvitation(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const find = await _drizzle_1.db.query.groups.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.groups.slug, input.group),
                });
                if (!find) {
                    throw new graphql_1.GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const checkInvitationFound = await _drizzle_1.db.query.groupInvitation.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupInvitation.groupId, find.id), (0, drizzle_orm_1.eq)(schema_1.groupInvitation.alumniId, id)),
                });
                if (!checkInvitationFound) {
                    throw new graphql_1.GraphQLError('No Invitation found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                if (checkInvitationFound.isAccepted === true) {
                    throw new graphql_1.GraphQLError('Invitation Already Accepted', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                await _drizzle_1.db
                    .update(schema_1.groupInvitation)
                    .set({ isAccepted: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.groupInvitation.groupId, checkInvitationFound.groupId));
                const addUserToGroup = await _drizzle_1.db
                    .insert(schema_1.groupMember)
                    .values({
                    alumniId: id,
                    groupId: find.id,
                })
                    .returning();
                return addUserToGroup;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async leaveGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const find = await _drizzle_1.db.query.groups.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.groups.slug, input.group),
                });
                if (!find) {
                    throw new graphql_1.GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const checkUser = await _drizzle_1.db.query.groupMember.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMember.groupId, find.id), (0, drizzle_orm_1.eq)(schema_1.groupMember.alumniId, id)),
                });
                if (!checkUser) {
                    throw new graphql_1.GraphQLError('You already leaved the group', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                console.log(checkUser);
                const leave = await _drizzle_1.db
                    .delete(schema_1.groupMember)
                    .where((0, drizzle_orm_1.eq)(schema_1.groupMember.alumniId, id));
                const removeInvitation = await _drizzle_1.db
                    .delete(schema_1.groupInvitation)
                    .where((0, drizzle_orm_1.eq)(schema_1.groupInvitation.alumniId, id));
                return true;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async joinGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const find = await _drizzle_1.db.query.groups.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.groups.id, input.group),
                    with: {
                        member: true,
                        setting: true,
                    },
                });
                if (!find) {
                    throw new graphql_1.GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const checkIfExist = await _drizzle_1.db.query.groupMember.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMember.groupId, find.id), (0, drizzle_orm_1.eq)(schema_1.groupMember.alumniId, id)),
                });
                const checkIfRequested = await _drizzle_1.db.query.groupRequest.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMember.groupId, find.id), (0, drizzle_orm_1.eq)(schema_1.groupMember.alumniId, id)),
                });
                if (checkIfExist) {
                    return new graphql_1.GraphQLError('You are AllReady in Group', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                if (checkIfRequested) {
                    return new graphql_1.GraphQLError(' All Ready requested', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                if (find?.setting?.joiningCondition === 'Admin only Add') {
                    const request = await _drizzle_1.db.query.groupRequest.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupRequest.groupId, find.id), (0, drizzle_orm_1.eq)(schema_1.groupRequest.alumniId, id)),
                    });
                    if (request) {
                        return new graphql_1.GraphQLError('Request AlReady sent', {
                            extensions: {
                                code: 400,
                                http: { status: 400 },
                            },
                        });
                    }
                    await _drizzle_1.db.insert(schema_1.groupRequest).values({
                        alumniId: id,
                        groupId: find.id,
                    });
                    return {
                        id: find.id,
                        isGroupMember: false,
                        isJoinRequest: true,
                    };
                }
                if (find?.setting?.joiningCondition === 'Anyone Can Join') {
                    _drizzle_1.db.query.groupMember.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMember.groupId, find.id), (0, drizzle_orm_1.eq)(schema_1.groupMember.alumniId, id)),
                    });
                    await _drizzle_1.db.insert(schema_1.groupMember).values({
                        alumniId: id,
                        groupId: find.id,
                    });
                    await _drizzle_1.db
                        .update(schema_1.groups)
                        .set({ numberOfUser: find.numberOfUser + 1 })
                        .where((0, drizzle_orm_1.eq)(schema_1.groups.id, find.id));
                    return {
                        id: find.id,
                        isGroupMember: true,
                        isJoinRequest: false,
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async likeFeed(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.feedReactions.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedReactions.alumniId, id), (0, drizzle_orm_1.eq)(schema_1.feedReactions.feedId, input.id)),
                });
                if (!find) {
                    const data = await _drizzle_1.db
                        .insert(schema_1.feedReactions)
                        .values({
                        alumniId: id,
                        feedId: input.id,
                        reactionsType: input.type,
                    })
                        .returning();
                    const set = await _drizzle_1.db.query.feedReactions.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedReactions.feedId, data[0].feedId), (0, drizzle_orm_1.eq)(schema_1.feedReactions.alumniId, data[0].alumniId)),
                        with: {
                            alumni: {
                                with: {
                                    alumni: {
                                        with: {
                                            aboutAlumni: true,
                                        },
                                    },
                                },
                            },
                        },
                    });
                    return {
                        feedId: set.feedId,
                        type: set.reactionsType,
                        user: {
                            ...set.alumni?.alumni,
                            aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
                        },
                    };
                }
                if (find) {
                    const data = await _drizzle_1.db
                        .update(schema_1.feedReactions)
                        .set({ reactionsType: input.type })
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedReactions.alumniId, id), (0, drizzle_orm_1.eq)(schema_1.feedReactions.feedId, input.id)))
                        .returning();
                    const set = await _drizzle_1.db.query.feedReactions.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feedReactions.feedId, data[0].feedId), (0, drizzle_orm_1.eq)(schema_1.feedReactions.alumniId, data[0].alumniId)),
                        with: {
                            alumni: {
                                with: {
                                    alumni: {
                                        with: {
                                            aboutAlumni: true,
                                        },
                                    },
                                },
                            },
                        },
                    });
                    return {
                        feedId: set.feedId,
                        type: set.reactionsType,
                        user: {
                            ...set.alumni?.alumni,
                            aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
                        },
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async acceptRequestGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const checkIfUserExists = await _drizzle_1.db.query.groupMember.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMember.groupId, input.groupID), (0, drizzle_orm_1.eq)(schema_1.groupMember.alumniId, input.alumniId)),
                });
                const group = await _drizzle_1.db.query.groups.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.groups.id, input.groupID),
                });
                if (checkIfUserExists)
                    return {
                        id: checkIfUserExists.alumniId,
                    };
                const checkIfRequestedValid = await _drizzle_1.db.query.groupRequest.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMember.groupId, input.groupID), (0, drizzle_orm_1.eq)(schema_1.groupMember.alumniId, input.alumniId)),
                });
                if (checkIfRequestedValid) {
                    if (input.accept) {
                        await _drizzle_1.db
                            .update(schema_1.groupRequest)
                            .set({ isAccepted: true })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupRequest.groupId, input.groupID), (0, drizzle_orm_1.eq)(schema_1.groupRequest.alumniId, input.alumniId)));
                        await _drizzle_1.db.insert(schema_1.groupMember).values({
                            alumniId: input.alumniId,
                            groupId: input.groupID,
                        });
                        await _drizzle_1.db
                            .update(schema_1.groups)
                            .set({ numberOfUser: group.numberOfUser + 1 })
                            .where((0, drizzle_orm_1.eq)(schema_1.groups.id, group.id));
                        return {
                            id: input.alumniId,
                        };
                    }
                    else {
                        await _drizzle_1.db
                            .delete(schema_1.groupRequest)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupRequest.groupId, input.groupID), (0, drizzle_orm_1.eq)(schema_1.groupRequest.alumniId, input.alumniId)));
                        return {
                            id: input.alumniId,
                        };
                    }
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.groupResolvers = groupResolvers;
