import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { db } from '../../@drizzle'
const client = new Client({
    url: 'http://localhost:1000',
    exchanges: [cacheExchange, fetchExchange],
})

const QUERY = `
query Query($input: email) {
  sendEmail(input: $input) {
    status
  }
}
`
const approveGroup = async (userId, orgId, group) => {
    try {
        const user = await db.query.alumniToOrganization.findFirst({
            where: (alumniToOrganization, { eq }) =>
                eq(alumniToOrganization.alumniId, userId),
            with: {
                alumni: true,
            },
        })
        const org = await db.query.organization.findFirst({
            where: (organization, { eq }) => eq(organization.id, orgId),
        })

        const orgData = {
            organizationName: org?.organizationName,
            logo: `https://cdn.thrico.network/${org.logo}`,
        }
        const userData = {
            email: user?.alumni.email,
            firstName: user?.alumni.firstName,
            lastName: user?.alumni.lastName,
        }

        const data = client
            .query(QUERY, {
                input: {
                    type: 'approvedGroup',
                    user: userData,
                    org: orgData,
                    group: {
                        title: group.title,
                    },
                },
            })
            .subscribe((result) => {
                console.log(result)
            })
    } catch (error) {
        console.log(error)
    }
}

export default approveGroup
