import { db } from '../../../../@drizzle'
import { organization } from '../../../../@drizzle/src/db/schema'
import { razorpayUtils } from './razorpay.utils'

const paymentResponse = async (org_id, amount) => {
    const razorpay = await razorpayUtils(org_id)
    const organizationCu = await db.query.organization.findFirst({
        where: (user, { eq }) => eq(organization.id, org_id),
        with: {
            currency: true,
        },
    })
    const options = {
        amount: Number(amount) * 100,
        currency: organizationCu.currency.cc,
        receipt: 'any unique id for every order',
        payment_capture: 1,
    }
    const response = await razorpay.razorpay.orders.create(options)

    return {
        ...response,
        key_id: razorpay.key_id,
    }
}

export default paymentResponse
