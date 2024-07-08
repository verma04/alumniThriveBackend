import { db } from '../../../../../@drizzle'

import { GraphQLError } from 'graphql'

import { checkEmail } from '../../utils/mail/checkmail.utils'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    customPages,
    domain,
    headerLinks,
    homePageCarousel,
    orgSocialMedia,
} from '../../../../../@drizzle/src/db/schema'
import { eq } from 'drizzle-orm'
import upload from '../../utils/upload/upload.utils'
import { userOrg } from '../admin/mentorship.resolvers'
import uploadImageToFolder from '../../utils/upload/uploadImageToFolder.utils'

const homePageResolvers = {
    Query: {
        async getHomePageCarousel(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)
                const carousel = await db.query.homePageCarousel.findFirst({
                    where: (homePageCarousel, { eq }) =>
                        eq(homePageCarousel.organization, userOrgId),
                })

                return carousel
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getHeaderLinks(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)
                const links = await db.query.headerLinks.findMany({
                    where: (headerLinks, { eq }) =>
                        eq(headerLinks.organization, userOrgId),
                    orderBy: (headerLinks, { asc }) => [asc(headerLinks.sort)],
                })

                return links
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getSocialMedia(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)
                const socialMedia = await db.query.orgSocialMedia.findFirst({
                    where: (orgSocialMedia, { eq }) =>
                        eq(orgSocialMedia.organization, userOrgId),
                })

                return socialMedia
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getCustomPages(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)
                const pages = await db.query.customPages.findMany({
                    where: (customPages, { eq }) =>
                        eq(customPages.organization, userOrgId),
                })

                return pages
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async updateHomePageCarousel(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)

                const set = input.map((set) => set.url)

                const upload = await uploadImageToFolder(userOrgId, set)

                console.log(upload)
                const org = upload.map((set) => ({
                    image: set.file,
                    organization: userOrgId,
                }))

                const createOrganization = await db
                    .insert(homePageCarousel)
                    .values(org)
                    .returning()
                console.log(createOrganization)
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async updateSocialMedia(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)
                console.log(input)

                const { twitter, linkedin, youtube, instagram } = input
                const update = await db
                    .update(orgSocialMedia)
                    .set({ twitter, linkedin, youtube, instagram })
                    .where(eq(orgSocialMedia.organization, userOrgId))
                    .returning()
                return update[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async updateHeaderLinks(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)

                console.log(input)

                const opt = input.map((set, index) => ({
                    sort: index,
                    ...set,
                    organization: userOrgId,
                }))

                await db
                    .delete(headerLinks)
                    .where(eq(headerLinks.organization, userOrgId))

                const links = await db
                    .insert(headerLinks)
                    .values(opt)
                    .returning()

                return links
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addCustomPages(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const userOrgId = await userOrg(data.id)

                // const update = await db
                //   .update(orgSocialMedia)
                //   .set({ twitter, linkedin, youtube, instagram })
                //   .where(eq(orgSocialMedia.organization, userOrgId))
                //   .returning();
                // return update[0];

                const page = await db
                    .insert(customPages)
                    .values({
                        title: input.title,
                        slug: input.slug,
                        organization: userOrgId,
                        metaDescription: input.metaDescription,
                        metaTitle: input.metaTitle,
                    })
                    .returning()
                return page
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { homePageResolvers }
