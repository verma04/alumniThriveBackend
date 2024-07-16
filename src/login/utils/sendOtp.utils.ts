import { encryptToken } from './crypto/jwt.crypto'
import { encryptOtp } from './crypto/otp.crypto'
import { db } from '../../@drizzle'
import { userOtp } from '../../@drizzle/src/db/schema'

const sendOtp = async (check: any) => {
    try {
        const generateOpt = Math.floor(1000 + Math.random() * 9000)

        const encryptedOtp = await encryptOtp(generateOpt)
        const data = await db
            .insert(userOtp)
            .values({ user: check.id, otp: encryptedOtp })
            .returning()

        return data[0]
    } catch (error) {
        console.log(error)
    }
}

export default sendOtp
