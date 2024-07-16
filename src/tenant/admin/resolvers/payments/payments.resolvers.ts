import { db } from '../../../../@drizzle'

import { GraphQLError } from 'graphql'

import { checkEmail } from '../../utils/mail/checkmail.utils'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    domain,
    organization,
    profileInfo,
    razorpay,
    stripe,
    theme,
    users,
} from '../../../../@drizzle/src/db/schema'
import { eq } from 'drizzle-orm'
import upload from '../../utils/upload/upload.utils'

const paymentResolvers = {
    Query: {
        async checkPaymentDetails(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const findUser = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                    with: {
                        organization: {
                            with: {
                                razorpay: true,
                                stripe: true,
                            },
                        },
                    },
                })

                console.log(findUser)

                return {
                    enabledRazorpay:
                        findUser?.organization?.razorpay?.isEnabled,
                    enabledStripe: findUser?.organization?.stripe?.isEnabled,
                    razorpayKeyId: findUser?.organization?.razorpay?.keyID,
                    razorpayKeySecret:
                        findUser?.organization?.razorpay?.keySecret,
                    stripeKeyId: findUser?.organization?.stripe?.keyID,
                    stripeKeySecret: findUser?.organization?.stripe?.keySecret,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addPaymentDetails(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const findUser = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                    with: {
                        organization: true,
                    },
                })
                console.log(input)
                if (input.enabledRazorpay) {
                    await db
                        .update(razorpay)
                        .set({
                            keyID: input.razorpayKeyId,
                            isEnabled: input.enabledRazorpay,
                            keySecret: input.razorpayKeySecret,
                        })
                        .where(
                            eq(razorpay.organization, findUser.organization.id)
                        )
                }

                if (input.enabledStripe) {
                    await db
                        .update(stripe)
                        .set({
                            keyID: input.stripeKeyId,
                            keySecret: input.stripeKeySecret,
                            isEnabled: input.enabledStripe,
                        })
                        .where(
                            eq(stripe.organization, findUser.organization.id)
                        )
                }

                // const createRazorpay = await db
                //   .insert(razorpay)
                //   .values({
                //     organization: findUser.organization.id,
                //     keyID: input.keyId,
                //     keySecret: input.keySecret,
                //   })
                //   .returning();
                // const createPayment = await db
                //   .insert(razorpay)
                //   .values({
                //     organization: findUser.organization.id,
                //     keyID: input.keyId,
                //     keySecret: input.keySecret,
                //   })
                //   .returning();
                // if (createPayment) {
                //   return {
                //     success: true,
                //   };
                // }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { paymentResolvers }
