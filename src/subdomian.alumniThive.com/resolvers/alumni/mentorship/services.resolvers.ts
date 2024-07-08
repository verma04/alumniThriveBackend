import { and, desc, eq } from 'drizzle-orm'
import { db } from '../../../../../@drizzle'
import {
    mentorShip,
    mentorShipBooking,
    mentorShipService,
} from '../../../../../@drizzle/src/db/schema'
import domainCheck from '../../../../commanUtils/domianCheck'
import checkAuth from '../../../utils/auth/checkAuth.utils'
import moment from 'moment'
import { GraphQLError } from 'graphql'
import { razorpayUtils } from '../../../utils/payments/razorpay.utils'
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
const servicesResolvers = {
    Query: {
        async getAllMentorServices(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)

                const user = await getOrganizationUser(data.id, org_id)

                const services = await db.query.mentorShipService.findMany({
                    where: (mentorShipService, { eq }) =>
                        and(eq(mentorShipService.mentorShip, user.id)),
                    orderBy: (mentorShipService, { desc }) => [
                        desc(mentorShipService.createdAt),
                    ],
                })

                return services
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getBookingRequest(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)

                const mentor = await db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) =>
                        and(eq(mentorShip.user, data.id)),
                    orderBy: (mentorShip, { asc }) => [
                        asc(mentorShip.createdAt),
                    ],
                })

                const booking = await db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) =>
                        and(eq(mentorShipBooking.mentor, mentor.id)),
                    with: {
                        service: true,
                        user: {
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
                return booking
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getUpcomingBooking(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)
                await domainCheck(context)

                const mentor = await db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) =>
                        and(eq(mentorShip.user, data.id)),
                })

                const booking = await db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) =>
                        and(
                            eq(mentorShipBooking.mentor, mentor.id),
                            eq(mentorShipBooking.isAccepted, true),
                            eq(mentorShipBooking.isCancel, false),
                            eq(mentorShipBooking.isCompleted, false)
                        ),
                    with: {
                        service: true,
                        user: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: (mentorShipBooking, { asc }) => [
                        desc(mentorShipBooking.createdAt),
                    ],
                })

                console.log(booking)
                return booking
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getCancelledBooking(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)
                await domainCheck(context)

                const mentor = await db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) =>
                        and(eq(mentorShip.user, data.id)),
                })

                const booking = await db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) =>
                        and(
                            eq(mentorShipBooking.mentor, mentor.id),
                            eq(mentorShipBooking.isCancel, true)
                        ),
                    orderBy: (mentorShipBooking, { asc }) => [
                        desc(mentorShipBooking.createdAt),
                    ],
                    with: {
                        service: true,
                        user: {
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

                console.log(booking)
                return booking
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getCompletedBooking(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)
                await domainCheck(context)

                const mentor = await db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) =>
                        and(eq(mentorShip.user, data.id)),
                })

                const booking = await db.query.mentorShipBooking.findMany({
                    where: (mentorShipBooking, { eq }) =>
                        and(
                            eq(mentorShipBooking.mentor, mentor.id),
                            eq(mentorShipBooking.isCompleted, true)
                        ),
                    orderBy: (mentorShipBooking, { desc }) => [
                        desc(mentorShipBooking.updatedAt),
                    ],
                    with: {
                        service: true,
                        user: {
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

                return booking
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addMentorShipServices(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)

                const user = await getOrganizationUser(data.id, org_id)

                const services = await db
                    .insert(mentorShipService)
                    .values({
                        serviceType: input.serviceType,
                        priceType: input.priceType,
                        duration: input.duration,
                        mentorShip: user.id,
                        title: input.title,
                        price: input.price ? input.price : 0,
                        webinarUrl: input.webinarUrl ? input.webinarUrl : '',
                        webinarDate: input.webinarDate ? input.webinarDate : '',
                    })
                    .returning()

                return services
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateMentorShipServices(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)

                const service = await db.query.mentorShipService.findFirst({
                    where: and(eq(mentorShipService.id, input.id)),
                })

                const title = service['title']
                delete service['id']
                delete service['title']
                const createServices = await db
                    .insert(mentorShipService)
                    .values({
                        title: `${title}-copy-1`,
                        ...service,
                    })
                    .returning()
                return createServices
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async acceptBookingRequest(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)
                console.log(input)

                const accept = await db
                    .update(mentorShipBooking)
                    .set({ requestStatus: 'ACCEPTED', isAccepted: true })
                    .where(eq(mentorShipBooking.id, input.bookingID))
                    .returning()
                return accept[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async cancelBooking(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)
                const orgId = await domainCheck(context)

                const razorpay = await razorpayUtils(orgId)
                const booking = await db.query.mentorShipBooking.findFirst({
                    where: (mentorShipBooking, { eq }) =>
                        and(eq(mentorShipBooking.id, input.bookingID)),
                })

                if (booking.isCancel) {
                    throw new GraphQLError('Booking AlReady Cancel', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                if (!booking.payment) {
                }
                if (booking.payment) {
                    const cancelBooking = await db
                        .update(mentorShipBooking)
                        .set({ isCancel: true })
                        .where(eq(mentorShipBooking.id, booking.id))
                        .returning()

                    const refund = await razorpay.razorpay.payments.refund(
                        booking.razorpay_payment_id,
                        {
                            amount: Number(booking.amount) * 100,
                            speed: 'normal',
                            notes: {
                                notes_key_1: 'Beam me up Scotty.',
                                notes_key_2: 'Engage',
                            },
                            receipt: `Cancel booking refund ${booking.id}`,
                        }
                    )
                }
                // const accept = await db
                //   .update(mentorShipBooking)
                //   .set({ requestStatus: "ACCEPTED", isAccepted: true })
                //   .where(eq(mentorShipBooking.id, input.bookingID))
                //   .returning();
                // return accept[0];
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async markBookingAsCompleted(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const booking = await db.query.mentorShipBooking.findFirst({
                    where: (mentorShipBooking, { eq }) =>
                        and(eq(mentorShipBooking.id, input.bookingID)),
                })

                if (booking.isCompleted) {
                    throw new GraphQLError('Booking AlReady Competed', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                const completeBooking = await db
                    .update(mentorShipBooking)
                    .set({ isCompleted: true })
                    .where(eq(mentorShipBooking.id, booking.id))
                    .returning()

                return completeBooking[0]
                // const accept = await db
                //   .update(mentorShipBooking)
                //   .set({ requestStatus: "ACCEPTED", isAccepted: true })
                //   .where(eq(mentorShipBooking.id, input.bookingID))
                //   .returning();
                // return accept[0];
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { servicesResolvers }
