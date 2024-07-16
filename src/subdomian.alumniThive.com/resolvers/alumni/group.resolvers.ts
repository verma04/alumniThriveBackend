import {
    and,
    arrayOverlaps,
    asc,
    desc,
    eq,
    ilike,
    inArray,
    ne,
    not,
    or,
    sql,
} from 'drizzle-orm'
import { db } from '../../../@drizzle'
import {
    groupInvitation,
    groupRequest,
    groups,
    groupsSetting,
    groupMember,
    feedReactions,
    events,
    groupInterests,
    groupTheme,
    groupTypeEnum,
    privacyEnum,
    groupViews,
    organizationTag,
    alumniToOrganization,
} from '../../../@drizzle/src/db/schema'
import {
    acceptInvitationInput,
    acceptRequestGroup,
    addGroupInput,
    feedLike,
    groupSlug,
    invitationInput,
} from '../../ts-types/group.ts-type'
import checkAuth from '../../utils/auth/checkAuth.utils'
import slugify from 'slugify'
import { GraphQLError } from 'graphql'
import domainCheck from '../../../commanUtils/domianCheck'

import upload from '../../utils/upload/upload.utils'
import approveGroup from '../../../queue/approveGroup.queue'

const groupConditions = (org_id, search, theme, interests, mode, privacy) => {
    const conditions = and(
        eq(groups.organization, org_id),
        eq(groups.isApproved, true),
        and(
            !search || search?.length === 0
                ? not(ilike(groups.title, `%${null}%`))
                : or(
                      ilike(groups.title, `%${search}%`),
                      ilike(groups.about, `%${search}%`)
                  ),
            !theme || theme.length === 0
                ? eq(groups.organization, org_id)
                : inArray(groupTheme.title, theme),
            !interests || interests.length === 0
                ? eq(groups.organization, org_id)
                : inArray(groupInterests.title, interests),
            mode
                ? eq(groupsSetting.groupType, mode)
                : eq(groups.organization, org_id),
            privacy
                ? eq(groupsSetting.privacy, privacy)
                : eq(groups.organization, org_id)
        )
    )
    return conditions
}

const groupConditionsFeatured = (
    org_id,
    search,
    theme,
    interests,
    mode,
    privacy
) => {
    const conditions = and(
        eq(groups.organization, org_id),
        eq(groups.isApproved, true),
        eq(groups.isFeatured, true),
        and(
            !search || search?.length === 0
                ? not(ilike(groups.title, `%${null}%`))
                : or(
                      ilike(groups.title, `%${search}%`),
                      ilike(groups.about, `%${search}%`)
                  ),
            !theme || theme.length === 0
                ? eq(groups.organization, org_id)
                : inArray(groupTheme.title, theme),
            !interests || interests.length === 0
                ? eq(groups.organization, org_id)
                : inArray(groupInterests.title, interests),
            mode
                ? eq(groupsSetting.groupType, mode)
                : eq(groups.organization, org_id),
            privacy
                ? eq(groupsSetting.privacy, privacy)
                : eq(groups.organization, org_id)
        )
    )
    return conditions
}

const groupView = async ({ id, group }) => {
    const checkView = await db.query.groupViews.findFirst({
        where: and(eq(groupViews.user, id), eq(groupViews.group, group.id)),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    })

    if (checkView) {
        //@ts-ignore
        const hours = Math.abs(Date.now() - checkView.createdAt) / 36e5
        if (hours >= 1) {
            await db.insert(groupViews).values({
                user: id,
                group: group.id,
            })

            await db
                .update(groups)
                .set({ numberOfViews: group.numberOfViews + 1 })
                .where(eq(groups.id, group.id))
        }
    } else {
        await db.insert(groupViews).values({
            user: id,
            group: group.id,
        })

        await db
            .update(groups)
            .set({ numberOfViews: group.numberOfViews + 1 })
            .where(eq(groups.id, group.id))
    }
}

const groupResolvers = {
    Query: {
        async getGroupTheme(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const interests = await db.query.groupTheme.findMany({
                    where: and(eq(groupTheme.organization, org_id)),
                })
                return interests
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getGroupInterests(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const interests = await db.query.groupInterests.findMany({
                    where: and(eq(groupInterests.organization, org_id)),
                })
                return interests
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getGroupModeType(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                return groupTypeEnum?.enumValues
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getGroupPrivacyEnum(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                return privacyEnum?.enumValues
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getYourGroup(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const {
                    search,
                    theme,
                    interests,
                    mode,
                    offset,
                    limit,
                    privacy,
                    sort,
                } = input

                const conditions = groupConditions(
                    org_id,
                    search,
                    theme,
                    interests,
                    mode,
                    privacy
                )

                const totalRecords = await db
                    .select({ count: sql`count(*)`.mapWith(Number) })
                    .from(groups)
                    .leftJoin(groupTheme, eq(groups.theme, groupTheme.id))
                    .leftJoin(
                        groupsSetting,
                        eq(groups.id, groupsSetting.groupId)
                    )

                    .where(conditions)

                const paginatedData = await db
                    .select({
                        group: groups,
                        groupMember: groupMember,
                        groupRequest: groupRequest,
                        groupsSetting: groupsSetting,
                        trending: groups.numberOfViews,
                    })
                    .from(groups)
                    .leftJoin(groupTheme, eq(groups.theme, groupTheme.id))
                    .fullJoin(
                        groupMember,
                        and(
                            eq(groups.id, groupMember.groupId),
                            eq(id, groupMember.alumniId)
                        )
                    )
                    .fullJoin(
                        groupRequest,
                        and(
                            eq(groups.id, groupRequest.groupId),
                            eq(id, groupRequest.alumniId)
                        )
                    )
                    .leftJoin(
                        groupsSetting,
                        eq(groups.id, groupsSetting.groupId)
                    )
                    .leftJoin(
                        groupInterests,
                        eq(groups.interest, groupInterests.id)
                    )
                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(9)
                    .orderBy(
                        sort === 'popular' && desc(groups.numberOfPost),
                        sort === 'viewed' && desc(groups.numberOfViews),
                        !sort && desc(groups.createdAt)
                    )

                const topTrending = paginatedData
                    .sort((a, b) => b.trending - a.trending)
                    .slice(0, 5)

                return {
                    totalRecords: totalRecords[0].count,
                    data: paginatedData.map((set) => ({
                        ...set?.group,
                        isGroupMember: set.groupMember ? true : false,
                        isJoinRequest: set.groupRequest ? true : false,
                        groupSettings: set.groupsSetting,
                        isTrending: topTrending.includes(set),
                    })),
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getGroupsRecommendation(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const user = await db.query.alumniToOrganization.findFirst({
                    where: and(
                        eq(alumniToOrganization.alumniId, id),
                        eq(alumniToOrganization.organizationId, org_id)
                    ),
                })

                const data = await db
                    .select({
                        // views: count(groupViews.id),
                        group: groups,
                        groupMember: groupMember,
                        groupRequest: groupRequest,
                        groupsSetting: groupsSetting,
                    })
                    .from(groups)
                    // .leftJoin(groupTheme, eq(groups.theme, groupTheme.id))
                    .leftJoin(groupViews, eq(groups.id, groupViews.group))
                    .leftJoin(
                        groupMember,
                        and(
                            eq(groups.id, groupMember.groupId),
                            eq(id, groupMember.alumniId)
                        )
                    )
                    .leftJoin(
                        groupRequest,
                        and(
                            eq(groups.id, groupRequest.groupId),
                            eq(id, groupRequest.alumniId)
                        )
                    )
                    .where(arrayOverlaps(groups.tag, user.tag))

                    .leftJoin(
                        groupsSetting,
                        eq(groups.id, groupsSetting.groupId)
                    )
                    .leftJoin(
                        groupInterests,
                        eq(groups.interest, groupInterests.id)
                    )

                    .limit(5)

                const re = data.map((set) => ({
                    ...set?.group,
                    isGroupMember: set.groupMember ? true : false,
                    isJoinRequest: set.groupRequest ? true : false,
                    groupSettings: set.groupsSetting,
                }))
                return re
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getFeaturedGroup(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                console.log('dssd')
                const {
                    search,
                    theme,
                    interests,
                    mode,
                    offset,
                    limit,
                    privacy,
                } = input

                const isTrending =
                    await db.query.trendingConditionsGroups.findFirst({
                        where: (trendingConditionsGroups, { eq }) =>
                            eq(trendingConditionsGroups.organization, org_id),
                    })
                console.log(isTrending)

                const conditions = groupConditionsFeatured(
                    org_id,
                    search,
                    theme,
                    interests,
                    mode,
                    privacy
                )

                const totalRecords = await db
                    .select({ count: sql`count(*)`.mapWith(Number) })
                    .from(groups)

                    .leftJoin(groupTheme, eq(groups.theme, groupTheme.id))
                    .leftJoin(
                        groupsSetting,
                        eq(groups.id, groupsSetting.groupId)
                    )

                    .where(conditions)

                const paginatedData = await db
                    .select({
                        group: groups,
                        groupMember: groupMember,
                        groupRequest: groupRequest,
                        groupsSetting: groupsSetting,
                    })
                    .from(groups)
                    .leftJoin(groupTheme, eq(groups.theme, groupTheme.id))
                    .fullJoin(
                        groupMember,
                        and(
                            eq(groups.id, groupMember.groupId),
                            eq(id, groupMember.alumniId)
                        )
                    )
                    .fullJoin(
                        groupRequest,
                        and(
                            eq(groups.id, groupRequest.groupId),
                            eq(id, groupRequest.alumniId)
                        )
                    )
                    .leftJoin(
                        groupsSetting,
                        eq(groups.id, groupsSetting.groupId)
                    )
                    .leftJoin(
                        groupInterests,
                        eq(groups.interest, groupInterests.id)
                    )
                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(9)
                    .orderBy(
                        isTrending.views && desc(groups.numberOfViews),
                        isTrending.user && desc(groups.numberOfUser),
                        isTrending.discussion && desc(groups.numberOfPost)
                    )

                return {
                    totalRecords: totalRecords[0].count,
                    data: paginatedData.map((set) => ({
                        ...set?.group,
                        isGroupMember: set.groupMember ? true : false,
                        isJoinRequest: set.groupRequest ? true : false,
                        groupSettings: set.groupsSetting,
                    })),
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getGroupBySlug(_: any, { input }: groupSlug, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const { slug } = await input

                const find = await db.query.groups.findFirst({
                    where: (d, { eq }) =>
                        and(
                            eq(d.slug, slug),
                            eq(d.organization, org_id),
                            eq(d.isApproved, true)
                        ),
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
                })

                if (find) {
                    const isJoinRequest = await find?.request.some(
                        (e) => e?.alumniId === id
                    )
                    const isGroupMember = await find?.member.some(
                        (e) => e?.alumniId === id
                    )

                    const isGroupAdmin = await find?.member.some(
                        (e) => e?.alumniId === id && e.role === 'admin'
                    )
                    groupView({ id, group: find })

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
                    }
                } else {
                    throw new GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getGroupBySlugPeople(_: any, { input }: groupSlug, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const { slug } = input

                const find = await db.query.groups.findFirst({
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
                })

                const data = await find.member.map((set) => ({
                    ...set?.alumni?.alumni,
                    role: set.role,
                    memberSince: set.createdAt,
                }))

                return data
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllGroupPeople(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const find = await db.query.groupMember.findMany({
                    where: and(eq(groupMember.groupId, input.id)),
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
                })
                return find.map((t) => ({
                    id: t?.alumniId,
                    role: t?.role,
                    user: {
                        ...t?.alumni?.alumni,
                        aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
                    },
                }))
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllGroupRequest(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                const find = await db.query.groupRequest.findMany({
                    where: and(
                        eq(groupRequest.groupId, input.id),
                        eq(groupRequest.isAccepted, false)
                    ),
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
                })
                return find.map((t) => ({
                    id: t.alumniId,
                    createdAt: t.createdAt,

                    user: {
                        ...t?.alumni?.alumni,
                        aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
                    },
                }))
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllGroupEvents(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                console.log(input)

                const find = await db.query.events.findMany({
                    where: and(eq(events.group, input.id)),
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
                })

                return find.map((t) => ({
                    ...t,
                    eventCreator: {
                        ...t?.eventCreator?.alumni,
                        aboutAlumni: t?.eventCreator?.alumni?.aboutAlumni,
                    },
                }))
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async createGroup(_: any, { input }: addGroupInput, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                console.log(input)

                const settings =
                    await db.query.organizationSettingsGroups.findFirst({
                        where: (organizationSettingsGroups, { eq }) =>
                            eq(organizationSettingsGroups.organization, org_id),
                    })

                const {
                    name,
                    privacy,
                    about,
                    groupType,
                    joiningCondition,
                    theme,
                    interest,
                    tag,
                } = input
                let cover
                if (input?.cover) {
                    cover = await upload(input.cover)
                }

                let slug = slugify(name, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                })
                const find = await db.query.groups.findMany({
                    where: (group, { eq }) => eq(group.slug, slug),
                })

                if (find) {
                    const val = Math.floor(1000 + Math.random() * 9000)
                    slug = slug + '-' + val
                }

                const createGroup = await db
                    .insert(groups)
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
                    .returning()

                await db.insert(groupsSetting).values({
                    joiningCondition: joiningCondition,
                    privacy: privacy,
                    groupId: createGroup[0].id,
                    groupType: groupType,
                })

                await db.insert(groupMember).values({
                    alumniId: id,
                    groupId: createGroup[0].id,
                    role: 'admin',
                })

                if (createGroup[0].isApproved) {
                    approveGroup(id, org_id, createGroup[0])
                }

                return createGroup
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async inviteMember(_: any, { input }: invitationInput, context: any) {
            try {
                const find = await db.query.groups.findFirst({
                    where: eq(groups.slug, input.group),
                })

                if (!find) {
                    throw new GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                const request = input.id.map((t) => ({
                    alumniId: t,
                    groupId: find.id,
                    isAccepted: false,
                }))

                const createInvitation = await db
                    .insert(groupInvitation)
                    .values(request)
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async acceptInvitation(
            _: any,
            { input }: acceptInvitationInput,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)
                const find = await db.query.groups.findFirst({
                    where: eq(groups.slug, input.group),
                })

                if (!find) {
                    throw new GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                const checkInvitationFound =
                    await db.query.groupInvitation.findFirst({
                        where: and(
                            eq(groupInvitation.groupId, find.id),
                            eq(groupInvitation.alumniId, id)
                        ),
                    })

                if (!checkInvitationFound) {
                    throw new GraphQLError('No Invitation found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                if (checkInvitationFound.isAccepted === true) {
                    throw new GraphQLError('Invitation Already Accepted', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                await db
                    .update(groupInvitation)
                    .set({ isAccepted: true })
                    .where(
                        eq(
                            groupInvitation.groupId,
                            checkInvitationFound.groupId
                        )
                    )

                const addUserToGroup = await db
                    .insert(groupMember)
                    .values({
                        alumniId: id,
                        groupId: find.id,
                    })
                    .returning()
                return addUserToGroup
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async leaveGroup(
            _: any,
            { input }: acceptInvitationInput,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)
                const find = await db.query.groups.findFirst({
                    where: eq(groups.slug, input.group),
                })

                if (!find) {
                    throw new GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                const checkUser = await db.query.groupMember.findFirst({
                    where: and(
                        eq(groupMember.groupId, find.id),
                        eq(groupMember.alumniId, id)
                    ),
                })

                if (!checkUser) {
                    throw new GraphQLError('You already leaved the group', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                console.log(checkUser)
                const leave = await db
                    .delete(groupMember)
                    .where(eq(groupMember.alumniId, id))
                const removeInvitation = await db
                    .delete(groupInvitation)
                    .where(eq(groupInvitation.alumniId, id))
                return true
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async joinGroup(
            _: any,
            { input }: acceptInvitationInput,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)
                const find = await db.query.groups.findFirst({
                    where: eq(groups.id, input.group),
                    with: {
                        member: true,
                        setting: true,
                    },
                })

                if (!find) {
                    throw new GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                const checkIfExist = await db.query.groupMember.findFirst({
                    where: and(
                        eq(groupMember.groupId, find.id),
                        eq(groupMember.alumniId, id)
                    ),
                })
                const checkIfRequested = await db.query.groupRequest.findFirst({
                    where: and(
                        eq(groupMember.groupId, find.id),
                        eq(groupMember.alumniId, id)
                    ),
                })

                if (checkIfExist) {
                    return new GraphQLError('You are AllReady in Group', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                if (checkIfRequested) {
                    return new GraphQLError(' All Ready requested', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                if (find?.setting?.joiningCondition === 'Admin only Add') {
                    const request = await db.query.groupRequest.findFirst({
                        where: and(
                            eq(groupRequest.groupId, find.id),
                            eq(groupRequest.alumniId, id)
                        ),
                    })
                    if (request) {
                        return new GraphQLError('Request AlReady sent', {
                            extensions: {
                                code: 400,
                                http: { status: 400 },
                            },
                        })
                    }

                    await db.insert(groupRequest).values({
                        alumniId: id,
                        groupId: find.id,
                    })

                    return {
                        id: find.id,
                        isGroupMember: false,
                        isJoinRequest: true,
                    }
                }

                if (find?.setting?.joiningCondition === 'Anyone Can Join') {
                    db.query.groupMember.findFirst({
                        where: and(
                            eq(groupMember.groupId, find.id),
                            eq(groupMember.alumniId, id)
                        ),
                    })

                    await db.insert(groupMember).values({
                        alumniId: id,
                        groupId: find.id,
                    })

                    await db
                        .update(groups)
                        .set({ numberOfUser: find.numberOfUser + 1 })
                        .where(eq(groups.id, find.id))

                    return {
                        id: find.id,
                        isGroupMember: true,
                        isJoinRequest: false,
                    }
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async likeFeed(_: any, { input }: feedLike, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                const find = await db.query.feedReactions.findFirst({
                    where: and(
                        eq(feedReactions.alumniId, id),
                        eq(feedReactions.feedId, input.id)
                    ),
                })

                if (!find) {
                    const data = await db
                        .insert(feedReactions)
                        .values({
                            alumniId: id,
                            feedId: input.id,
                            reactionsType: input.type,
                        })
                        .returning()
                    const set = await db.query.feedReactions.findFirst({
                        where: and(
                            eq(feedReactions.feedId, data[0].feedId),
                            eq(feedReactions.alumniId, data[0].alumniId)
                        ),
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
                    })
                    return {
                        feedId: set.feedId,
                        type: set.reactionsType,
                        user: {
                            ...set.alumni?.alumni,
                            aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
                        },
                    }
                }
                if (find) {
                    const data = await db
                        .update(feedReactions)
                        .set({ reactionsType: input.type })
                        .where(
                            and(
                                eq(feedReactions.alumniId, id),
                                eq(feedReactions.feedId, input.id)
                            )
                        )
                        .returning()
                    const set = await db.query.feedReactions.findFirst({
                        where: and(
                            eq(feedReactions.feedId, data[0].feedId),
                            eq(feedReactions.alumniId, data[0].alumniId)
                        ),
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
                    })
                    return {
                        feedId: set.feedId,
                        type: set.reactionsType,
                        user: {
                            ...set.alumni?.alumni,
                            aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
                        },
                    }
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async acceptRequestGroup(
            _: any,
            { input }: acceptRequestGroup,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)
                const checkIfUserExists = await db.query.groupMember.findFirst({
                    where: and(
                        eq(groupMember.groupId, input.groupID),
                        eq(groupMember.alumniId, input.alumniId)
                    ),
                })

                const group = await db.query.groups.findFirst({
                    where: eq(groups.id, input.groupID),
                })

                if (checkIfUserExists)
                    return {
                        id: checkIfUserExists.alumniId,
                    }

                const checkIfRequestedValid =
                    await db.query.groupRequest.findFirst({
                        where: and(
                            eq(groupMember.groupId, input.groupID),
                            eq(groupMember.alumniId, input.alumniId)
                        ),
                    })
                if (checkIfRequestedValid) {
                    if (input.accept) {
                        await db
                            .update(groupRequest)
                            .set({ isAccepted: true })
                            .where(
                                and(
                                    eq(groupRequest.groupId, input.groupID),
                                    eq(groupRequest.alumniId, input.alumniId)
                                )
                            )

                        await db.insert(groupMember).values({
                            alumniId: input.alumniId,
                            groupId: input.groupID,
                        })

                        await db
                            .update(groups)
                            .set({ numberOfUser: group.numberOfUser + 1 })
                            .where(eq(groups.id, group.id))

                        return {
                            id: input.alumniId,
                        }
                    } else {
                        await db
                            .delete(groupRequest)
                            .where(
                                and(
                                    eq(groupRequest.groupId, input.groupID),
                                    eq(groupRequest.alumniId, input.alumniId)
                                )
                            )
                        return {
                            id: input.alumniId,
                        }
                    }
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { groupResolvers }
