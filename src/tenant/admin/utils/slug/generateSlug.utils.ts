import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
const generateSlug = async () => {
    return nanoid(10)
}

export default generateSlug
