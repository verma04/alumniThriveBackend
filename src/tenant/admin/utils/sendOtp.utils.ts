import { db } from '../../../@drizzle'
import { otp } from '../../../@drizzle/src/db/schema'
import { encryptToken } from './crypto/jwt.crypto'
import { encryptOtp } from './crypto/otp.crypto'
const { v4: uuidv4 } = require('uuid')
import { Resend } from 'resend'
import { Email } from '../../../../emails/Auth'
const resend = new Resend('re_ffA6ZDsH_2zRWoE7frNLJMPNWny4dGpaV;')
import { render } from '@react-email/render'
import sendEmailOtp from '../../../queue/otp.queue'
const sendOtp = async (check: any) => {
    try {
        const generateOpt = Math.floor(1000 + Math.random() * 9000)

        const encryptedOtp = await encryptOtp(generateOpt)
        const data = await db
            .insert(otp)
            .values({ userId: check.id, otp: encryptedOtp })
            .returning()

        sendEmailOtp(check.email, generateOpt)

        return data[0]
    } catch (error) {
        console.log(error)
    }
}

export default sendOtp
