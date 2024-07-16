"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@urql/core");
const _drizzle_1 = require("../@drizzle");
const client = new core_1.Client({
    url: 'http://localhost:1000',
    exchanges: [core_1.cacheExchange, core_1.fetchExchange],
});
const QUERY = `
query Query($input: email) {
  sendEmail(input: $input) {
    status
  }
}
`;
const approveGroup = async (userId, orgId, group) => {
    try {
        const user = await _drizzle_1.db.query.alumniToOrganization.findFirst({
            where: (alumniToOrganization, { eq }) => eq(alumniToOrganization.alumniId, userId),
            with: {
                alumni: true,
            },
        });
        const org = await _drizzle_1.db.query.organization.findFirst({
            where: (organization, { eq }) => eq(organization.id, orgId),
        });
        const orgData = {
            organizationName: org?.organizationName,
            logo: `https://cdn.thrico.network/${org.logo}`,
        };
        const userData = {
            email: user?.alumni.email,
            firstName: user?.alumni.firstName,
            lastName: user?.alumni.lastName,
        };
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
            console.log(result);
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = approveGroup;
