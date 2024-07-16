import { db } from '../../../../@drizzle'

import { GraphQLError } from 'graphql'

import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    domain,
    orgSocialMedia,
    organization,
    organizationSettings,
    organizationSettingsGroups,
    razorpay,
    stripe,
    theme,
    trendingConditionsGroups,
    users,
} from '../../../../@drizzle/src/db/schema'
import { eq } from 'drizzle-orm'
import upload from '../../utils/upload/upload.utils'
import { userOrg } from './mentorship.resolvers'

const organizationResolvers = {
    Query: {
        async getOrganization(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const checkUser = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data?.id),
                    with: {
                        organization: true,
                        profileInfo: true,
                    },
                })

                return checkUser
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async checkDomain(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const findDomain = await db.query.domain.findFirst({
                    where: (user, { eq }) => eq(user.domain, input.domain),
                })

                if (findDomain) {
                    return new GraphQLError(
                        'Sorry, that domain already exists. Please try a different one.',
                        {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        }
                    )
                }
                return {
                    success: true,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getCurrency(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const currency = await db.query.currency.findMany()

                return currency
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getOrganizationCurrency(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const orgId = await userOrg(data.id)

                const organizationCu = await db.query.organization.findFirst({
                    where: (user, { eq }) => eq(organization.id, orgId),
                    with: {
                        currency: true,
                    },
                })

                return organizationCu.currency
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async registerOrganization(_: any, { input }: any, context: any) {
            try {
                const {
                    phone,
                    designation,
                    domain: organizationDomain,
                    address,
                    organizationName,
                    category,
                    timeZone,
                    logo,
                    website,
                } = input
                const data = await checkAuth(context)

                let uploadedLogo 
                
                if(logo) {
               uploadedLogo = await upload(logo)
                }

                const checkUser = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data?.id),
                    with: {
                        organization: true,
                        profileInfo: true,
                    },
                })

                if (checkUser.organization) {
                    return {
                        success: true,
                    }
                }
                const findDomain = await db.query.domain.findFirst({
                    where: (user, { eq }) =>
                        eq(user.domain, organizationDomain),
                })

                if (findDomain) {
                    return new GraphQLError(
                        'Sorry, that domain already exists. Please try a different one.',
                        {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        }
                    )
                }
                const createOrganization = await db
                    .insert(organization)
                    .values({
                        address,
                        category,
                        timeZone,
                        logo: uploadedLogo ? uploadedLogo : "Thrico_LogoMark_Color.png",
                        organizationName,
                        website,
                        userId: checkUser.id,
                        favicon: uploadedLogo,
                    })
                    .returning()
                await db.insert(theme).values({
                    organizationId: createOrganization[0]?.id,
                })

                await db.insert(razorpay).values({
                    isEnabled: false,
                    organization: createOrganization[0]?.id,
                })
                await db.insert(organizationSettings).values({
                    organization: createOrganization[0]?.id,
                })
                await db.insert(organizationSettingsGroups).values({
                    organization: createOrganization[0]?.id,
                    autoApprove: false,
                })
                await db.insert(trendingConditionsGroups).values({
                    organization: createOrganization[0]?.id,
                })
                await db.insert(stripe).values({
                    isEnabled: false,
                    organization: createOrganization[0]?.id,
                })
                await db.insert(orgSocialMedia).values({
                    organization: createOrganization[0]?.id,
                })
                await db
                    .insert(domain)
                    .values({
                        organizationId: createOrganization[0]?.id,
                        domain: organizationDomain,
                    })
                    .returning()
                return {
                    success: true,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async changeThemeColor(_: any, { input }: any, context: any) {
            try {
                const { colorPrimary, borderRadius, colorBgContainer } = input
                const data = await checkAuth(context)

                const findUser = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                    with: {
                        organization: true,
                    },
                })

                const updateTheme = await db
                    .update(theme)
                    .set({ colorPrimary, borderRadius, colorBgContainer })
                    .where(eq(theme.organizationId, findUser?.organization.id))
                    .returning()

                console.log(updateTheme)
                return updateTheme[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async updateCurrency(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const orgId = await userOrg(data.id)

                const updatedCurrency = await db
                    .update(organization)
                    .set({ currency: input.id })
                    .where(eq(organization.id, orgId))
                    .returning()
                console.log(updatedCurrency)

                return updatedCurrency[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { organizationResolvers }
