import { and, eq } from 'drizzle-orm'
import { db } from '../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import checkAuth from '../../utils/auth/checkAuth.utils'
import { alumniFeed, jobs } from '../../../@drizzle/src/db/schema'
import slugify from 'slugify'
import generateSlug from '../../../tenant/admin/utils/slug/generateSlug.utils'

const jobsResolvers = {
    Query: {
        async getAllJobs(_: any, { input }: any, context: any) {
            try {
                await checkAuth(context)

                const org_id = await domainCheck(context)

                const allJobs = await db.query.jobs.findMany({
                    where: and(eq(jobs.organization, org_id)),
                    with: {
                        postedBy: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                })

                return allJobs
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getJobPostedByMe(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const allJobs = await db.query.jobs.findMany({
                    where: and(
                        eq(jobs.postedBy, id),
                        eq(jobs.organization, org_id)
                    ),
                    with: {
                        postedBy: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                })

                console.log(allJobs)
                return allJobs
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getJobBySlug(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const job = await db.query.jobs.findFirst({
                    where: and(
                        eq(jobs.slug, input.slug),
                        eq(jobs.organization, org_id)
                    ),
                    with: {
                        postedBy: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                })

                return job
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async postJob(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                let slug = slugify(input.jobTitle, {
                    replacement: '-',
                    remove: /[*+~.()'"!:,@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                })
                const findJobs = await db.query.jobs.findFirst({
                    where: (jobs, { eq }) => eq(jobs.slug, slug),
                })

                if (findJobs) {
                    const val = Math.floor(1000 + Math.random() * 9000)
                    slug = slug + '-' + val
                }
                const addedJobs = await db
                    .insert(jobs)
                    .values({
                        ...input,
                        organization: org_id,
                        postedBy: id,
                        slug,
                    })
                    .returning()

                const createFeed = await db
                    .insert(alumniFeed)
                    .values({
                        alumniId: id,
                        organization: org_id,
                        description: 'New Job Added',
                        jobs: addedJobs[0].id,
                        feedForm: 'jobs',
                    })
                    .returning()
                console.log(createFeed)

                return addedJobs
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateJob(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                const slug = await generateSlug()
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
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { jobsResolvers }
