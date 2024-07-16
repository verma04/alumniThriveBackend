import { and, eq, or } from 'drizzle-orm'
import { db } from '../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    chat,
    jobs,
    marketPlace,
    marketPlaceImages,
    messages,
} from '../../../@drizzle/src/db/schema'
import slugify from 'slugify'

import uploadImageToFolder from '../../../tenant/admin/utils/upload/uploadImageToFolder.utils'
import generateSlug from '../../utils/slug/generateSlug'
import { GraphQLError } from 'graphql'

const marketPlaceResolvers = {
    Query: {
        async getAllMarketPlaceListing(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const list = await db.query.marketPlace.findMany({
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    where: (marketPlace, { eq }) =>
                        eq(marketPlace.organization, org_id),
                    with: {
                        images: true,
                        postedBy: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                })

                console.log(list)
                return list
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async postListing(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                // console.log(input);

                const images = await uploadImageToFolder(
                    `${org_id}/marketPlace`,
                    input.images
                )

                let slug = generateSlug(input?.title)
                const findListing = await db.query.marketPlace.findFirst({
                    where: (marketPlace, { eq }) => eq(marketPlace.slug, slug),
                })

                if (findListing) {
                    const val = Math.floor(1000 + Math.random() * 9000)
                    slug = slug + '-' + val
                }
                const addListing = await db
                    .insert(marketPlace)
                    .values({
                        postedBy: id,
                        organization: org_id,
                        condition: input.condition,
                        sku: input.sku,
                        price: input.price,
                        title: input.title,
                        description: input.description,
                        location: input.location,
                        currency: input.currency,
                        slug,
                    })
                    .returning()

                const upload = images.map((set) => ({
                    url: set.file,
                    marketPlace: addListing[0].id,
                }))

                if (upload.length > 0) {
                    await db.insert(marketPlaceImages).values(upload)
                }
                const list = await db.query.marketPlace.findMany({
                    where: (marketPlace, { eq }) =>
                        eq(marketPlace.id, addListing[0].id),
                    with: {
                        images: true,
                    },
                })

                return list
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async contactMarketPlace(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                console.log(input)

                if (id === input.userId) {
                    return new GraphQLError('Action not Allowed', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                const checkChat = await db.query.chat.findFirst({
                    where: and(
                        or(eq(chat.user1, input.userId), eq(chat.user1, id)),
                        or(eq(chat.user2, id), eq(chat.user2, input.userId))
                    ),
                })

                if (checkChat) {
                    console.log(checkChat)

                    const newChat = await db
                        .insert(messages)
                        .values({
                            chatId: checkChat.id,
                            content: 'Information of this listing',
                            senderId: id,
                            marketPlace: input.listingId,
                            messageType: 'marketPlace',
                        })
                        .returning()

                    const details = await db.query.messages.findFirst({
                        where: and(eq(messages.id, newChat[0].id)),
                        with: {
                            sender: true,
                        },
                    })

                    return checkChat
                }

                const newChat = await db
                    .insert(chat)
                    .values({
                        user1: id,
                        user2: input.userID,
                    })
                    .returning()
                console.log(newChat)
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { marketPlaceResolvers }
