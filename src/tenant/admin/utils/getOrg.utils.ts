import { db } from '../../../@drizzle'
import { eq } from 'drizzle-orm'
const getOrg = async (id: string) => {
    const org = await db.query.loginSession.findFirst({
        where: (loginSession, { eq }) => eq(loginSession.id, id),
    })
    console.log(org)
    const uses = await db.query.users.findFirst({
        where: (loginSession, { eq }) => eq(loginSession.id, id),
    })
    console.log(uses)
}

export default getOrg
