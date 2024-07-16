import { and, eq } from 'drizzle-orm'
import { db } from '../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    alumniToOrganization,
    eventHost,
    events,
} from '../../../@drizzle/src/db/schema'

const alumniResolvers = {
    Query: {
        async getAllConnection(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.id)),
                })

                const host = await db.query.eventHost.findMany({
                    where: and(eq(eventHost.eventId, event.id)),
                })

                const user = await db.query.alumniToOrganization.findMany({
                    where: and(
                        eq(alumniToOrganization.isApproved, true),
                        eq(alumniToOrganization.isRequested, true),
                        eq(alumniToOrganization.organizationId, org_id)
                    ),
                    with: {
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                })
                const arr = []
                console.log(user)

                user.forEach(async (t) => {
                    const set = await host.some(
                        ({ alumniId }) => t.alumniId === alumniId
                    )
                    if (set) {
                        arr.push({
                            ...t.alumni,
                            isAdded: set,
                        })
                    } else {
                        arr.push({
                            ...t.alumni,
                            isAdded: set,
                        })
                    }
                })

                return arr
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllOrganizationUser(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const user = await db.query.alumniToOrganization.findMany({
                    where: and(
                        eq(alumniToOrganization.isApproved, true),
                        eq(alumniToOrganization.isRequested, true),
                        eq(alumniToOrganization.organizationId, org_id)
                    ),
                    with: {
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                })

                console.log(user.map((set) => set.alumni))

                return user.map((set) => set.alumni)
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {},
}

export { alumniResolvers }
