import { and, eq } from 'drizzle-orm'

import checkAuth from '../../../utils/auth/checkAuth.utils'
import { userOrg } from '../mentorship.resolvers'
import { db } from '../../../../../@drizzle'
import { GraphQLError } from 'graphql'
import { groupTheme } from '../../../../../@drizzle/src/db/schema'

const themeResolvers = {
    Query: {
        async getAllGroupTheme(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const theme = await db.query.groupTheme.findMany({
                    where: (groupTheme, { eq }) =>
                        eq(groupTheme.organization, userOrgId),
                    orderBy: (groupTheme, { desc }) => [
                        desc(groupTheme.createdAt),
                    ],
                })

                return theme
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addGroupTheme(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const set = await db.query.groupTheme.findFirst({
                    where: (groupTheme, { eq }) =>
                        and(
                            eq(groupTheme.organization, userOrgId),
                            eq(groupTheme.title, input.title)
                        ),
                })

                if (set) {
                    return new GraphQLError(
                        "The theme name 'AllReady' already exists",
                        {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        }
                    )
                }
                const newGroupTheme = await db
                    .insert(groupTheme)
                    .values({
                        title: input.title,
                        organization: userOrgId,
                    })
                    .returning()

                return newGroupTheme
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteGroupTheme(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                await userOrg(data.id)
                const theme = await db
                    .delete(groupTheme)
                    .where(eq(groupTheme.id, input.id))
                    .returning()

                return {
                    id: input.id,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateGroupTheme(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const theme = await db.query.groupTheme.findFirst({
                    where: and(eq(groupTheme.id, input.id)),
                })

                const newTheme = await db
                    .insert(groupTheme)
                    .values({
                        organization: theme.organization,
                        title: `${theme.title}-copy-1`,
                    })
                    .returning()
                return newTheme
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async editGroupTheme(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)
                const userOrgId = await userOrg(id)

                const theme = await db
                    .update(groupTheme)
                    .set({ title: input.title })
                    .where(eq(groupTheme.id, input.id))
                    .returning()

                return theme[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { themeResolvers }
