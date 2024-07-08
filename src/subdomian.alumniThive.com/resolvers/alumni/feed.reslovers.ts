import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import {
    alumniFeed,
    feedComment,
    groups,
    media,
} from '../../../../@drizzle/src/db/schema'
import { groupFeed } from '../../ts-types/group.ts-type'
import checkAuth from '../../utils/auth/checkAuth.utils'
import slugify from 'slugify'

import domainCheck from '../../../commanUtils/domianCheck'
import uploadFeedImage from '../../../tenant/admin/utils/upload/uploadFeedImage.utils'

const feedResolvers = {
    Query: {
        async getGroupFeed(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const find = await db.query.alumniFeed.findMany({
                    where: (d, { eq }) => eq(d.groupId, input.id),
                    orderBy: [desc(alumniFeed.createdAt)],
                    limit: 10,
                    offset: input.offset,
                    with: {
                        media: true,
                        reactions: {
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
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                })

                const feed = await find.map((t) => ({
                    id: t.id,
                    description: t.description,
                    media: t.media,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }))

                return feed
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllAlumniFeed(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const find = await db.query.alumniFeed.findMany({
                    where: and(
                        eq(alumniFeed.alumniId, id),
                        eq(alumniFeed.organization, org_id),
                        eq(alumniFeed.feedForm, 'group')
                    ),

                    with: {
                        reactions: {
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

                        group: true,
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                })

                const feed = await find.map((t) => ({
                    id: t.id,
                    description: t.description,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    feedForm: t.feedForm,
                    job: t.jobs,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }))

                return feed

                // return { ...find, privacy: find?.setting?.privacy };
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllUserFeed(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const find = await db.query.alumniFeed.findMany({
                    where: and(eq(alumniFeed.organization, org_id)),
                    orderBy: (alumniFeed, { desc }) => [
                        desc(alumniFeed.createdAt),
                    ],
                    with: {
                        media: true,
                        reactions: {
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

                        group: true,
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                })

                const feed = await find.map((t) => ({
                    id: t.id,
                    media: t.media,
                    description: t.description,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }))

                return feed

                // return { ...find, privacy: find?.setting?.privacy };
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getFeedComment(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                console.log(input)

                const find = await db.query.alumniFeed.findFirst({
                    where: and(eq(alumniFeed.id, input.id)),
                    with: {
                        comment: {
                            with: {
                                user: {
                                    with: {
                                        alumni: true,
                                    },
                                },
                            },
                        },
                    },
                })
                console.log(find.comment)

                return find.comment
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getGroupFeedByUser(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const find = await db.query.alumniFeed.findMany({
                    where: (d, { eq }) =>
                        and(eq(d.feedForm, 'group'), eq(d.alumniId, id)),
                    orderBy: [desc(alumniFeed.createdAt)],

                    with: {
                        media: true,
                        reactions: {
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
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                })

                const feed = await find.map((t) => ({
                    id: t.id,
                    description: t.description,
                    media: t.media,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }))

                return feed
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addFeedGroup(_: any, { input }: groupFeed, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)

                const feedImages = await uploadFeedImage(org_id, input.image)

                const createFeed = await db
                    .insert(alumniFeed)
                    .values({
                        description: input.description,
                        alumniId: id,
                        feedForm: 'group',
                        groupId: input.groupId,
                        organization: org_id,
                    })
                    .returning()

                if (feedImages.length > 0) {
                    const values = await feedImages.map((set) => ({
                        feedId: createFeed[0].id,
                        url: set.file,
                        organization: org_id,
                        alumni: id,
                        groupId: input.groupId,
                    }))
                    console.log(values)
                    const img = await db
                        .insert(media)
                        .values(values)
                        .returning()
                    console.log(img)
                }

                const find = await db.query.alumniFeed.findFirst({
                    where: (d, { eq }) => eq(d.id, createFeed[0].id),
                    orderBy: [desc(alumniFeed.createdAt)],

                    with: {
                        media: true,
                        reactions: {
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
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                })
                const findGroup = await db.query.groups.findFirst({
                    where: eq(groups.id, input.groupId),
                    with: {
                        member: true,
                        setting: true,
                    },
                })

                await db
                    .update(groups)
                    .set({ numberOfPost: findGroup.numberOfPost + 1 })
                    .where(eq(groups.id, input.groupId))

                return {
                    id: find.id,
                    description: find.description,
                    createdAt: find.createdAt,
                    user: find?.alumni?.alumni,
                    reactions: find?.reactions?.map((set) => ({
                        type: set?.reactionsType,
                        user: {
                            ...set?.alumni?.alumni,
                            aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
                        },
                    })),
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addFeedComment(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const feed = await db
                    .insert(feedComment)
                    .values({
                        feed: input.feedId,
                        content: input.content,
                        user: id,
                    })
                    .returning()

                console.log(feed)

                return feed
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { feedResolvers }
