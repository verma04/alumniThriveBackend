"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _drizzle_1 = require("../@drizzle");
const graphql_1 = require("graphql");
const domainCheck = async (domain) => {
    const checkDomain = domain
        .get('origin')
        ?.split('.')[0]
        ?.replace('http://', '');
    const findDomain = await _drizzle_1.db.query.domain.findFirst({
        where: (user, { eq }) => eq(user.domain, checkDomain),
    });
    if (!findDomain)
        throw new graphql_1.GraphQLError('Permission Denied', {
            extensions: {
                code: 403,
                http: { status: 403 },
            },
        });
    return findDomain.organizationId;
};
exports.default = domainCheck;
