import { db } from '../../../../@drizzle'
import { and } from 'drizzle-orm'
const Razorpay = require('razorpay')
const razorpayUtils = async (orgId) => {
    const organization = await db.query.razorpay.findFirst({
        where: (razorpay, { eq }) => and(eq(razorpay.organization, orgId)),
    })

    console.log(organization)
    const razorpay = new Razorpay({
        key_id: organization.keyID,
        key_secret: organization.keySecret,
    })

    return { razorpay, key_id: organization.keyID }
}

export { razorpayUtils }
