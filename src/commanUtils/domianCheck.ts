import { db } from '../../@drizzle'
import { GraphQLError } from 'graphql'

const domainCheck = async (domain: any) => {
    const checkDomain = domain
        .get('origin')
        ?.split('.')[0]
        ?.replace('http://', '')

    console.log(checkDomain)

    const findDomain = await db.query.domain.findFirst({
        where: (user, { eq }) => eq(user.domain, checkDomain),
    })

    if (!findDomain)
        throw new GraphQLError('Permission Denied', {
            extensions: {
                code: 403,
                http: { status: 403 },
            },
        })

    return findDomain.organizationId
}

export default domainCheck
