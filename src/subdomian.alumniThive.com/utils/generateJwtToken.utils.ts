import jwt from 'jsonwebtoken'
import { encryptToken } from './crypto/jwt.crypto'

const generateJwtToken = async (user: any) => {
    console.log(user.id)
    const jwtToken = await jwt.sign(
        {
            id: user.userId,
        },
        process.env.JWT_TOKEN,
        { expiresIn: '1555555555555555555555555555555555555555555555555555h' }
    )

    const encrypt = encryptToken(jwtToken)
    return encrypt
}

export default generateJwtToken
