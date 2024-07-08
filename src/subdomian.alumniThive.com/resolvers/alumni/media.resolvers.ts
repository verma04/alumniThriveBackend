import { eq } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import { getMedia } from '../../ts-types/media.ts-type'
import checkAuth from '../../utils/auth/checkAuth.utils'
import { media } from '../../../../@drizzle/src/db/schema'

const mediaResolvers = {
    Query: {
        async getMediaByGroup(_: any, { input }: getMedia, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const find = await db.query.media.findMany({
                    where: eq(media.groupId, input.group),
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    with: {},
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

export { mediaResolvers }
