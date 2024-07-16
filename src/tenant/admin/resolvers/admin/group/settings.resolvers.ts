import checkAuth from '../../../utils/auth/checkAuth.utils'
import { userOrg } from '../mentorship.resolvers'
import { db } from '../../../../../@drizzle'
import {
    organizationSettings,
    organizationSettingsGroups,
    trendingConditionsGroups,
} from '../../../../../@drizzle/src/db/schema'
import { eq } from 'drizzle-orm'

const settingsResolvers = {
    Query: {
        async getGroupSettings(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const settings =
                    await db.query.organizationSettingsGroups.findFirst({
                        where: (organizationSettingsGroups, { eq }) =>
                            eq(
                                organizationSettingsGroups.organization,
                                userOrgId
                            ),
                    })
                const isTrending =
                    await db.query.trendingConditionsGroups.findFirst({
                        where: (trendingConditionsGroups, { eq }) =>
                            eq(
                                trendingConditionsGroups.organization,
                                userOrgId
                            ),
                    })

                return {
                    autoApprove: settings.autoApprove,
                    ...isTrending,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async updateGroupSettings(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                console.log(input)

                const settings = await db
                    .update(organizationSettingsGroups)
                    .set({ autoApprove: input.autoApprove })
                    .where(
                        eq(organizationSettingsGroups.organization, userOrgId)
                    )
                    .returning()
                const trendingSettings = await db
                    .update(trendingConditionsGroups)
                    .set({
                        user: input.user,
                        discussion: input.discussion,
                        views: input.views,
                    })
                    .where(eq(trendingConditionsGroups.organization, userOrgId))
                    .returning()
                return {
                    autoApprove: settings[0].autoApprove,
                    ...trendingSettings[0],
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { settingsResolvers }
