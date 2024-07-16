import { and, eq } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import { mentorShip } from '../../../../@drizzle/src/db/schema'
import domainCheck from '../../../../commanUtils/domianCheck'
import checkAuth from '../../../utils/auth/checkAuth.utils'
const uniqueSlug = require('unique-slug')
const categoryResolvers = {
    Query: {
        async getAllMentorCategory(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)
                console.log(org_id)

                const set = await db.query.mentorshipCategory.findMany({
                    where: (mentorshipCategory, { eq }) =>
                        eq(mentorshipCategory.organization, org_id),
                    orderBy: (mentorshipCategory, { desc }) => [
                        desc(mentorshipCategory.createdAt),
                    ],
                    with: {
                        mentorShip: true,
                    },
                })

                return set.map((set) => ({
                    id: set.id,
                    title: set.title,
                    count: set.mentorShip.length,
                }))
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllMentorSkills(_: any, { input }: any, context: any) {
            try {
                await checkAuth(context)
                const org_id = await domainCheck(context)
                console.log(org_id)

                const set = await db.query.mentorshipSkills.findMany({
                    where: (mentorshipSkills, { eq }) =>
                        eq(mentorshipSkills.organization, org_id),
                    orderBy: (mentorshipSkills, { desc }) => [
                        desc(mentorshipSkills.createdAt),
                    ],
                })

                return set.map((set) => ({
                    id: set.id,
                    title: set.title,
                    count: 1,
                }))
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async checkMentorShip(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)
                const find = await await db.query.mentorShip.findFirst({
                    where: and(
                        eq(mentorShip.user, data.id),
                        eq(mentorShip.organization, org_id)
                    ),
                })

                console.log(find)
                if (find) {
                    return {
                        ...find,
                        isRequested: true,
                    }
                } else {
                    return {
                        isRequested: false,
                    }
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async checkMentorShipUrl(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async registerMentorShip(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const randomSlug = uniqueSlug()
                const org_id = await domainCheck(context)

                const availability = [
                    {
                        name: 'Monday',
                        isDisabled: false,
                    },
                    {
                        name: 'Tuesday',
                        isDisabled: false,
                    },
                    {
                        name: 'Wednesday',
                        isDisabled: false,
                    },
                    {
                        name: 'Thursday',
                        isDisabled: false,
                    },
                    {
                        name: 'Friday',
                        isDisabled: false,
                    },
                    {
                        name: 'Saturday',
                        isDisabled: false,
                    },
                    {
                        name: 'Sunday',
                        isDisabled: false,
                    },
                ]

                const createMentorShipProfile = await db
                    .insert(mentorShip)
                    .values({
                        mentorshipCategory: input.category,
                        organization: org_id,
                        displayName: input.displayName,
                        isApproved: false,
                        slug: randomSlug,
                        featuredArticle: input.featuredArticle,
                        intro: input.intro,
                        whyDoWantBecomeMentor: input.whyDoWantBecomeMentor,
                        greatestAchievement: input.greatestAchievement,
                        introVideo: input.introVideo,
                        about: input.about,
                        user: data.id,
                        availability,
                        agreement: input.agreement,
                    })
                    .returning()

                console.log(createMentorShipProfile)
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { categoryResolvers }
