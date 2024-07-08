import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../@drizzle'
import checkAuth from '../../../utils/auth/checkAuth.utils'
import domainCheck from '../../../../commanUtils/domianCheck'
import {
    mentorShip,
    mentorShipService,
} from '../../../../../@drizzle/src/db/schema'

const getOrganizationUser = async (id, org_id) => {
    const user = await db.query.mentorShip.findFirst({
        where: (mentorShip, { eq }) =>
            and(eq(mentorShip.user, id), eq(mentorShip.organization, org_id)),
    })
    return user
}
const mentorResolvers = {
    Query: {
        async getAllApprovedMentor(_: any, {}: any, context: any) {
            try {
                await checkAuth(context)
                const org_id = await domainCheck(context)
                const find = await await db.query.mentorShip.findMany({
                    where: and(
                        eq(mentorShip.isApproved, true),
                        eq(mentorShip.organization, org_id)
                    ),
                    with: {
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

                return find
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllMentorServicesByID(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)

                const user = await getOrganizationUser(data.id, org_id)
                const find = await await db.query.mentorShipService.findMany({
                    where: and(eq(mentorShipService.mentorShip, input.id)),
                })

                return find
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getMentorProfileBySlug(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)

                const find = await await db.query.mentorShip.findFirst({
                    where: and(
                        eq(mentorShip.slug, input.id),
                        eq(mentorShip.organization, org_id)
                    ),
                    with: {
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

                return find
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {},
}

export { mentorResolvers }
