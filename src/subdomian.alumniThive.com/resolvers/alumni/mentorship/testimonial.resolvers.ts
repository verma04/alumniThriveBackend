import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../@drizzle'
import {
    mentorShip,
    mentorShipService,
    mentorShipTestimonials,
} from '../../../../../@drizzle/src/db/schema'
import domainCheck from '../../../../commanUtils/domianCheck'
import checkAuth from '../../../utils/auth/checkAuth.utils'
import moment from 'moment'
const uniqueSlug = require('unique-slug')

enum servicesType {
    '1:1 Call' = '1:1 Call',
    'Subscription' = 'Subscription',
    'Webinar' = 'Webinar',
}
enum priceType {
    'free' = 'free',
    'paid' = 'paid',
}

interface services {
    servicesType: servicesType
    priceType: priceType
    title: string
    duration: number
    price?: number
    shortDescription: number
    webinarUrl?: string
}
interface serviceInput {
    input: services
}
const getOrganizationUser = async (id, org_id) => {
    const user = await db.query.mentorShip.findFirst({
        where: (mentorShip, { eq }) =>
            and(eq(mentorShip.user, id), eq(mentorShip.organization, org_id)),
    })
    return user
}
const testimonialsResolvers = {
    Query: {
        async getAllMentorTestimonial(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)

                const user = await getOrganizationUser(data.id, org_id)

                const testimonial =
                    await db.query.mentorShipTestimonials.findMany({
                        where: (mentorShipTestimonials, { eq }) =>
                            and(eq(mentorShipTestimonials.mentorShip, user.id)),
                        orderBy: (mentorShipTestimonials, { desc }) => [
                            desc(mentorShipTestimonials.createdAt),
                        ],
                    })

                console.log(testimonial)
                return testimonial
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addMentorShipTestimonials(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)

                const user = await getOrganizationUser(data.id, org_id)

                const testimonial = await db
                    .insert(mentorShipTestimonials)
                    .values({
                        testimonial: input.testimonial,
                        from: input.from,
                        mentorShip: user.id,
                    })
                    .returning()

                return testimonial
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateMentorShipTestimonials(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)

                const testimonial =
                    await db.query.mentorShipTestimonials.findFirst({
                        where: and(eq(mentorShipTestimonials.id, input.id)),
                    })

                delete testimonial['id']

                const createTestimonial = await db
                    .insert(mentorShipTestimonials)
                    .values({
                        ...testimonial,
                    })
                    .returning()
                return createTestimonial
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { testimonialsResolvers }
