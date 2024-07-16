import { and, desc, eq } from 'drizzle-orm'
import { db } from '../../../../@drizzle'

import checkAuth from '../../utils/auth/checkAuth.utils'

import { userOrg } from './mentorship.resolvers'
import {
    alumniStory,
    alumniStoryCategory,
} from '../../../../@drizzle/src/db/schema'
import { GraphQLError } from 'graphql'

const alumniStoriesResolvers = {
    Query: {
        async getAllAlumniStoriesCategory(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const category = await db.query.alumniStoryCategory.findMany({
                    where: (alumniStoryCategory, { eq }) =>
                        eq(alumniStoryCategory.organization, userOrgId),
                    orderBy: (alumniStoryCategory, { desc }) => [
                        desc(alumniStoryCategory.createdAt),
                    ],
                })

                return category
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllAlumniStories(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const stories = await db.query.alumniStory.findMany({
                    where: (alumniStory, { eq }) =>
                        and(eq(alumniStory.organization, userOrgId)),
                    orderBy: (alumniStory, { desc }) => [
                        desc(alumniStory.createdAt),
                    ],
                    with: {
                        category: true,
                        user: {
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

                console.log(stories)
                return stories
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getAllApprovedAlumniStories(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const stories = await db.query.alumniStory.findMany({
                    where: (alumniStory, { eq }) =>
                        and(
                            eq(alumniStory.organization, userOrgId),
                            eq(alumniStory.isApproved, true)
                        ),
                    orderBy: (alumniStory, { desc }) => [
                        desc(alumniStory.createdAt),
                    ],
                    with: {
                        category: true,
                        user: {
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

                return stories
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getAllApprovedRequestedStories(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const stories = await db.query.alumniStory.findMany({
                    where: (alumniStory, { eq }) =>
                        and(
                            eq(alumniStory.organization, userOrgId),
                            eq(alumniStory.isApproved, false)
                        ),
                    orderBy: (alumniStory, { desc }) => [
                        desc(alumniStory.createdAt),
                    ],
                    with: {
                        category: true,
                        user: {
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

                return stories
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addAlumniStoryCategory(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const set = await db.query.alumniStoryCategory.findFirst({
                    where: (alumniStoryCategory, { eq }) =>
                        and(
                            eq(alumniStoryCategory.organization, userOrgId),
                            eq(alumniStoryCategory.title, input.title)
                        ),
                })

                console.log(set)

                if (set) {
                    return new GraphQLError('Category AllReady exist', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    })
                }
                const createOrganization = await db
                    .insert(alumniStoryCategory)
                    .values({
                        title: input.title,
                        organization: userOrgId,
                    })
                    .returning()
                return createOrganization
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteAlumniStoryCategory(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                await userOrg(data.id)
                const category = await db
                    .delete(alumniStoryCategory)
                    .where(eq(alumniStoryCategory.id, input.id))
                    .returning()
                return category
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateAlumniStoryCategory(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)

                const category = await db.query.alumniStoryCategory.findFirst({
                    where: and(eq(alumniStoryCategory.id, input.id)),
                })

                console.log(input)

                const createFeedBack = await db
                    .insert(alumniStoryCategory)
                    .values({
                        organization: category.organization,
                        title: `${category.title}-copy-1`,
                    })
                    .returning()
                return createFeedBack
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async alumniStoriesActions(_: any, { input }: any, context: any) {
            try {
                const check = await db.query.alumniStory.findFirst({
                    where: (alumniStory, { eq }) =>
                        and(eq(alumniStory.id, input.ID)),
                })

                const update = await db
                    .update(alumniStory)
                    .set({ isApproved: true })
                    .where(eq(alumniStory.id, input.ID))
                    .returning()
                return update[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { alumniStoriesResolvers }
