import { db } from '../@drizzle'

const verifyDomain = async (domain: any) => {
    const checkDomain = domain?.split('.')[0]?.replace('http://', '')

    const findDomain = await db.query.domain.findFirst({
        where: (user, { eq }) => eq(user.domain, checkDomain),
    })

    return findDomain.organizationId
}

export default verifyDomain
