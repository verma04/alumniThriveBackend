import { and, desc, eq } from 'drizzle-orm'
import { db } from '../../../../../@drizzle'

import checkAuth from '../../utils/auth/checkAuth.utils'

import { userOrg } from './mentorship.resolvers'
import {
    campaign,
    campaignCategory,
} from '../../../../../@drizzle/src/db/schema'
import { GraphQLError } from 'graphql'

const givingResolvers = {
    Query: {
        async getAllFundCampaignCategory(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const category = await db.query.campaignCategory.findMany({
                    where: (campaignCategory, { eq }) =>
                        eq(campaignCategory.organization, userOrgId),
                    orderBy: (campaignCategory, { desc }) => [
                        desc(campaignCategory.createdAt),
                    ],
                })

                console.log(category)
                return category
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllFundCampaign(_: any, { input }: any, context: any) {
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
        async getAllApprovedFundCampaign(_: any, { input }: any, context: any) {
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
        async getAllRequestedFundCampaign(
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
        async addFundCampaignCategory(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const set = await db.query.campaignCategory.findFirst({
                    where: (campaignCategory, { eq }) =>
                        and(
                            eq(campaignCategory.organization, userOrgId),
                            eq(campaignCategory.title, input.title)
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
                const newCampaignCategory = await db
                    .insert(campaignCategory)
                    .values({
                        title: input.title,
                        organization: userOrgId,
                    })
                    .returning()
                console.log(newCampaignCategory)
                return newCampaignCategory
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteCampaignCategory(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                await userOrg(data.id)
                const category = await db
                    .delete(campaignCategory)
                    .where(eq(campaignCategory.id, input.id))
                    .returning()
                return category
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateCampaignCategory(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const category = await db.query.campaignCategory.findFirst({
                    where: and(eq(campaignCategory.id, input.id)),
                })

                console.log(input)

                const createFeedBack = await db
                    .insert(campaignCategory)
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

        async fundCampaignActions(_: any, { input }: any, context: any) {
            try {
                const check = await db.query.alumniStory.findFirst({
                    where: (alumniStory, { eq }) =>
                        and(eq(alumniStory.id, input.ID)),
                })

                const update = await db
                    .update(campaign)
                    .set({ isApproved: true })
                    .where(eq(campaign.id, input.ID))
                    .returning()
                return update[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { givingResolvers }
