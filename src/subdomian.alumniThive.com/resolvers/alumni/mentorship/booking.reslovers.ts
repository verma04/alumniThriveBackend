import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../@drizzle'
import checkAuth from '../../../utils/auth/checkAuth.utils'
import {
    mentorShipBooking,
    organization,
} from '../../../../../@drizzle/src/db/schema'
import domainCheck from '../../../../commanUtils/domianCheck'
const Razorpay = require('razorpay')

const razorpay = new Razorpay({
    key_id: 'rzp_test_LxtWwBs0es58iy',
    key_secret: 'oCxX71pESz5miUDN1BMfgNMH',
})

const bookingResolvers = {
    Query: {
        async checkWebinarPaymentResponse(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const data = await checkAuth(context)

                const org_id = await domainCheck(context)

                const organizationCu = await db.query.organization.findFirst({
                    where: (user, { eq }) => eq(organization.id, org_id),
                    with: {
                        currency: true,
                    },
                })

                const services = await db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) =>
                        and(eq(mentorShipService.id, input.id)),
                })

                if (services.priceType === 'paid') {
                    const options = {
                        amount: Number(services.price) * 100,
                        currency: organizationCu.currency.cc,
                        receipt: 'any unique id for every order',
                        payment_capture: 1,
                    }
                    const response = await razorpay.orders.create(options)

                    return { ...response, payment: true }
                } else {
                    return {
                        payment: false,
                    }
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getServicesDetails(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const booking = await db.query.mentorShipBooking.findFirst({
                    where: (mentorShipBooking, { eq }) =>
                        and(
                            eq(mentorShipBooking.service, input.id),
                            eq(mentorShipBooking.user, data.id)
                        ),
                })

                const services = await db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) =>
                        and(eq(mentorShipService.id, input.id)),
                    with: {
                        mentorship: {
                            with: {
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
                        },
                    },
                })
                console.log(booking)

                return {
                    booking: {
                        isBooking: booking ? true : false,
                        createdAt: booking ? booking.createdAt : null,
                    },
                    ...services,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async bookPaidWebinar(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const booking = await db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) =>
                        and(eq(mentorShipService.id, input.serviceID)),
                    with: {
                        mentorship: true,
                    },
                })

                await db.insert(mentorShipBooking).values({
                    razorpay_order_id: input.razorpay_order_id,
                    razorpay_payment_id: input.razorpay_payment_id,
                    razorpay_signature: input.razorpay_signature,
                    service: input.serviceID,
                    user: data.id,
                    payment: true,
                    mentor: booking.mentorship.id,
                    isAccepted: true,
                    amount: booking.price,
                })

                return {
                    success: true,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async bookFreeWebinar(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const booking = await db.query.mentorShipService.findFirst({
                    where: (mentorShipService, { eq }) =>
                        and(eq(mentorShipService.id, input.serviceID)),
                    with: {
                        mentorship: true,
                    },
                })

                await db.insert(mentorShipBooking).values({
                    service: input.serviceID,
                    user: data.id,
                    payment: false,
                    isAccepted: true,

                    mentor: booking.mentorship.id,
                })

                return {
                    success: true,
                }

                // const services = await db.query.mentorShipService.findFirst({
                //   where: (mentorShipService, { eq }) =>
                //     and(eq(mentorShipService.id, input.id)),
                // });
                // const options = {
                //   amount: Number(services.price) * 100,
                //   currency: "USD",
                //   receipt: "any unique id for every order",
                //   payment_capture: 1,
                // };
                // const response = await razorpay.orders.create(options);
                // console.log(response);
                // return response;
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { bookingResolvers }
