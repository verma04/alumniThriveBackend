import checkAuth from '../../../utils/auth/checkAuth.utils'
import { userOrg } from '../mentorship.resolvers'
import { db } from '../../../../../../@drizzle'
import { GraphQLError } from 'graphql'
import {
    groupInterests,
    groupTheme,
} from '../../../../../../@drizzle/src/db/schema'
import { and, eq } from 'drizzle-orm'

const interestsResolvers = {
    Query: {
        async getAllGroupInterests(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const groupInterests = await db.query.groupInterests.findMany({
                    where: (groupInterests, { eq }) =>
                        eq(groupInterests.organization, userOrgId),
                    orderBy: (groupInterests, { desc }) => [
                        desc(groupInterests.createdAt),
                    ],
                })

                return groupInterests
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addGroupInterests(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const set = await db.query.groupInterests.findFirst({
                    where: (groupInterests, { eq }) =>
                        and(
                            eq(groupInterests.organization, userOrgId),
                            eq(groupInterests.title, input.title)
                        ),
                })

                if (set) {
                    return new GraphQLError(
                        "The Interests name 'AllReady' already exists",
                        {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        }
                    )
                }
                const newGroupInterests = await db
                    .insert(groupInterests)
                    .values({
                        title: input.title,
                        organization: userOrgId,
                    })
                    .returning()

                return newGroupInterests
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteGroupInterests(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                await userOrg(data.id)
                const interests = await db
                    .delete(groupInterests)
                    .where(eq(groupInterests.id, input.id))
                    .returning()
                return interests
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateGroupInterests(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const interests = await db.query.groupInterests.findFirst({
                    where: and(eq(groupInterests.id, input.id)),
                })

                console.log(input)

                const newInterests = await db
                    .insert(groupInterests)
                    .values({
                        organization: interests.organization,
                        title: `${interests.title}-copy-1`,
                    })
                    .returning()
                return newInterests
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async editGroupInterests(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const interests = await db
                    .update(groupInterests)
                    .set({ title: input.title })
                    .where(eq(groupInterests.id, groupInterests.id))
                    .returning()
                return interests
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { interestsResolvers }
