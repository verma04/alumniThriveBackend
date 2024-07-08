import { and, eq } from 'drizzle-orm'
import domainCheck from '../../../../commanUtils/domianCheck'
import checkAuth from '../../../utils/auth/checkAuth.utils'
import { db } from '../../../../../@drizzle'
import { alumniToOrganization } from '../../../../../@drizzle/src/db/schema'

const tagResolvers = {
    Query: {
        async getProfileTag(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                const user = await db.query.alumniToOrganization.findFirst({
                    where: and(
                        eq(alumniToOrganization.alumniId, id),
                        eq(alumniToOrganization.organizationId, org_id)
                    ),
                })
                return user.tag
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async editProfileTag(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                console.log(input)

                const updated = await db
                    .update(alumniToOrganization)
                    .set({ tag: input.tag })
                    .where(
                        and(
                            eq(alumniToOrganization.alumniId, id),
                            eq(alumniToOrganization.organizationId, org_id)
                        )
                    )
                    .returning()
                return updated[0].tag
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { tagResolvers }
