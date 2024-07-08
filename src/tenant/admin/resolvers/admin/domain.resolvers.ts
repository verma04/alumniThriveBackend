import { eq } from 'drizzle-orm'
import { db } from '../../../../../@drizzle'
import { customDomain } from '../../../../../@drizzle/src/db/schema'
import { userOrg } from './mentorship.resolvers'
import checkAuth from '../../utils/auth/checkAuth.utils'

const checkDomainCName = async (domain: any) => {
    const response = await fetch(
        `https://networkcalc.com/api/dns/lookup/${domain.domain}`
    )
    const res = await response.json()
    console.log(res)

    if (res?.records?.CNAME) {
        if (res?.records?.CNAME[0]?.address === 'thrico.network') {
            await db
                .update(customDomain)
                .set({ dnsConfig: true, status: true })
                .where(eq(customDomain.id, domain.id))
        }
    }
}

const checkSSl = async (domain: any) => {
    const response = await fetch(
        `https://ssl-checker.io/api/v1/check/${domain.domain}`
    )
    const res = await response.json()
    console.log(res)

    if (res?.result.response !== 'failed') {
        await db
            .update(customDomain)
            .set({ ssl: true })
            .where(eq(customDomain.id, domain.id))
    }
}

const domainResolvers = {
    Query: {
        async getCustomDomain(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const domain = await db.query.customDomain.findFirst({
                    where: eq(customDomain.organization, userOrgId),
                })

                return domain
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async checkDomainIsVerified(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const domain = await db.query.customDomain.findFirst({
                    where: eq(customDomain.organization, userOrgId),
                })

                if (domain) {
                    if (!domain?.status) checkDomainCName(domain)
                    if (!domain?.ssl) checkSSl(domain)
                }
                return domain
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async updateDomain(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const createCustomDomain = await db
                    .insert(customDomain)
                    .values({
                        domain: input.domain,
                        organization: userOrgId,
                    })
                    .returning()
                return createCustomDomain[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteDomain(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                await db
                    .delete(customDomain)
                    .where(eq(customDomain.organization, userOrgId))
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { domainResolvers }
