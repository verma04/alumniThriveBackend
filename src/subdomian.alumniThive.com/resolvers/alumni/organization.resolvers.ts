import { db } from '../../../../@drizzle'

import { GraphQLError } from 'graphql'

import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    alumniKyc,
    alumniToOrganization,
    organization,
    organizationTag,
} from '../../../../@drizzle/src/db/schema'
import { and, eq } from 'drizzle-orm'

import { inputKyc, kyc } from '../../ts-types/types'

import domainCheck from '../../../commanUtils/domianCheck'

const organizationResolvers = {
    Query: {
        async checkDomain(_: any, { domain }: any, context: any) {
            const findDomain = await db.query.domain.findFirst({
                where: (d, { eq }) =>
                    eq(d.domain, domain?.split('.')[0]?.replace('http://', '')),
            })
            if (!findDomain) {
                return new GraphQLError('No Domain Found', {
                    extensions: {
                        code: 'NOT FOUND',
                        http: { status: 404 },
                    },
                })
            }

            const findOrg = await db.query.organization.findFirst({
                where: (d, { eq }) => eq(d.id, findDomain.organizationId),
                with: {
                    theme: true,
                },
            })

            return findOrg
        },
        async getUser(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)

                const org_id = await domainCheck(context)

                const findOrg = await db.query.alumniToOrganization.findFirst({
                    where: and(
                        eq(alumniToOrganization.alumniId, data.id),
                        eq(alumniToOrganization.organizationId, org_id)
                    ),
                    with: {
                        followers: true,
                        following: true,
                    },
                })

                const findUser = await db.query.alumni.findFirst({
                    where: (d, { eq }) => eq(d.id, findOrg.alumniId),
                })

                return {
                    id: findUser.id,
                    firstName: findUser.firstName,
                    lastName: findUser.lastName,
                    email: findUser.email,
                    isApproved: findOrg.isApproved,
                    isRequested: findOrg.isRequested,
                    avatar: findUser.avatar,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getCurrency(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)

                const org_id = await domainCheck(context)

                const organizationCu = await db.query.organization.findFirst({
                    where: (user, { eq }) => eq(organization.id, org_id),
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

        async getHomePageCarousel(_: any, { domain }: any, context: any) {
            const findDomain = await db.query.domain.findFirst({
                where: (d, { eq }) =>
                    eq(d.domain, domain?.split('.')[0]?.replace('http://', '')),
            })
            if (!findDomain) {
                return new GraphQLError('No Domain Found', {
                    extensions: {
                        code: 'NOT FOUND',
                        http: { status: 404 },
                    },
                })
            }

            const findOrg = await db.query.organization.findFirst({
                where: (d, { eq }) => eq(d.id, findDomain.organizationId),
                with: {
                    theme: true,
                },
            })

            const sli = await db.query.homePageCarousel.findMany({
                where: (d, { eq }) =>
                    eq(d.organization, findDomain.organizationId),
            })

            return sli
        },

        async getHeaderLinks(_: any, { domain }: any, context: any) {
            try {
                const findDomain = await db.query.domain.findFirst({
                    where: (d, { eq }) =>
                        eq(
                            d.domain,
                            domain?.split('.')[0]?.replace('http://', '')
                        ),
                })
                if (!findDomain) {
                    return new GraphQLError('No Domain Found', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 404 },
                        },
                    })
                }

                const findOrg = await db.query.organization.findFirst({
                    where: (d, { eq }) => eq(d.id, findDomain.organizationId),
                    with: {
                        theme: true,
                    },
                })

                const links = await db.query.headerLinks.findMany({
                    where: (d, { eq }) =>
                        eq(d.organization, findDomain.organizationId),
                    orderBy: (headerLinks, { asc }) => [asc(headerLinks.sort)],
                })

                return links
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getOrganizationTag(_: any, { domain }: any, context: any) {
            try {
                const org = await domainCheck(context)
                const tags = await db.query.organizationTag.findMany({
                    where: (d, { eq }) =>
                        eq(d.organization, organizationTag.organization),
                })

                return tags
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getModuleFaq(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const org_id = await domainCheck(context)

                const faqs = await db.query.moduleFaqs.findMany({
                    where: (d, { eq }) =>
                        and(
                            eq(d.organization, org_id),
                            eq(d.faqModule, input.module)
                        ),
                    orderBy: (moduleFaqs, { asc }) => [asc(moduleFaqs.sort)],
                })
                return faqs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async completeKyc(_: any, { input }: inputKyc, context: any) {
            try {
                const {
                    affliction,
                    referralSource,
                    comment,
                    agreement,
                    identificationNumber,
                } = input
                const data = await checkAuth(context)

                const findOrg = await db.query.alumniToOrganization.findFirst({
                    where: (d, { eq }) => eq(d.alumniId, data.id),
                })

                await db.insert(alumniKyc).values({
                    affliction: affliction,
                    referralSource: referralSource,
                    comment: comment,
                    agreement: agreement,
                    orgId: findOrg.organizationId,
                })

                const datas = await db
                    .update(alumniToOrganization)
                    .set({ isRequested: true })
                    .where(eq(alumniToOrganization.alumniId, data.id))
                    .returning()

                return {
                    success: true,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { organizationResolvers }
