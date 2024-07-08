import checkAuth from '../../../utils/auth/checkAuth.utils'
import { userOrg } from '../mentorship.resolvers'
import { db } from '../../../../../../@drizzle'
import { GraphQLError } from 'graphql'
import {
    groupInterests,
    groupTheme,
    groups,
} from '../../../../../../@drizzle/src/db/schema'
import { SQL, and, eq, inArray, sql } from 'drizzle-orm'

const approvalResolvers = {
    Query: {
        async getAllGroupStatus(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const {
                    all,
                    isApproved,
                    isBlocked,
                    isPaused,
                    isRejected,
                    isFeatured,
                } = input
                if (all) {
                    const group = await db.query.groups.findMany({
                        where: (groups, { eq }) =>
                            eq(groups.organization, userOrgId),
                        orderBy: (groups, { desc }) => [desc(groups.createdAt)],
                        with: {
                            theme: true,
                            interest: true,
                            setting: true,
                        },
                    })

                    return group
                } else {
                    const group = await db.query.groups.findMany({
                        where: (groups, { eq }) =>
                            and(
                                eq(groups.organization, userOrgId),
                                eq(
                                    groups.isApproved,
                                    isApproved ? isApproved : false
                                ),
                                eq(
                                    groups.isBlocked,
                                    isBlocked ? isBlocked : false
                                ),
                                eq(
                                    groups.isRejected,
                                    isRejected ? isRejected : false
                                ),
                                eq(
                                    groups.isPaused,
                                    isPaused ? isPaused : false
                                ),
                                eq(
                                    groups.isFeatured,
                                    isFeatured ? isFeatured : false
                                )
                            ),
                        orderBy: (groups, { desc }) => [desc(groups.createdAt)],
                        with: {
                            theme: true,
                            interest: true,
                            setting: true,
                        },
                    })
                    return group
                }
                // const groupInterests = await db.query.groupInterests.findMany({
                //   where: (groupInterests, { eq }) =>
                //     eq(groupInterests.organization, userOrgId),
                //   orderBy: (groupInterests, { desc }) => [
                //     desc(groupInterests.createdAt),
                //   ],
                // });

                // return groupInterests;
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addFeaturedGroup(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                console.log(input)

                if (input.length === 0) {
                    return
                }

                await db
                    .update(groups)
                    .set({ isFeatured: true })
                    .where(inArray(groups.id, input))
                // const groupInterests = await db.query.groupInterests.findMany({
                //   where: (groupInterests, { eq }) =>
                //     eq(groupInterests.organization, userOrgId),
                //   orderBy: (groupInterests, { desc }) => [
                //     desc(groupInterests.createdAt),
                //   ],
                // });

                // return groupInterests;
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { approvalResolvers }
