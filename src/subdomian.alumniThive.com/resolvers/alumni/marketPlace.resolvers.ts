import { and, eq } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    jobs,
    marketPlace,
    marketPlaceImages,
} from '../../../../@drizzle/src/db/schema'
import slugify from 'slugify'

import uploadImageToFolder from '../../../tenant/admin/utils/upload/uploadImageToFolder.utils'
import generateSlug from '../../utils/slug/generateSlug'

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
                    },
                })

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

        async duplicateJob(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                const slug = await generateSlug(input.id)
                const form = await db.query.jobs.findFirst({
                    where: and(eq(jobs.id, input.id)),
                })

                const duplicateJob = await db
                    .insert(jobs)
                    .values({
                        postedBy: form.postedBy,
                        organization: form.organization,
                        jobTitle: `${form.jobTitle}-copy-1`,
                        jobType: form.jobType,
                        company: form.company,
                        salary: form.salary,
                        slug,
                        description: form.description,
                        location: form.location,
                        workplaceType: form.workplaceType,
                        experience: form.experience,
                        tag: form.tag,
                    })
                    .returning()

                return duplicateJob
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async applyJob(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                console.log(input.id)

                // const slug = await generateSlug();
                // const form = await db.query.jobs.findFirst({
                //   where: and(eq(jobs.id, input.id)),
                // });

                // const duplicateJob = await db
                //   .insert(jobs)
                //   .values({
                //     postedBy: form.postedBy,
                //     organization: form.organization,
                //     jobTitle: `${form.jobTitle}-copy-1`,
                //     jobType: form.jobType,
                //     company: form.company,
                //     salary: form.salary,
                //     slug,
                //     description: form.description,
                //     location: form.location,
                //     workplaceType: form.workplaceType,
                //     experience: form.experience,
                //     tag: form.tag,
                //   })
                //   .returning();

                // return duplicateJob;
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { marketPlaceResolvers }
