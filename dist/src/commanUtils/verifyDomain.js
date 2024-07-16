"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _drizzle_1 = require("../@drizzle");
const verifyDomain = async (domain) => {
    const checkDomain = domain?.split('.')[0]?.replace('http://', '');
    const findDomain = await _drizzle_1.db.query.domain.findFirst({
        where: (user, { eq }) => eq(user.domain, checkDomain),
    });
    return findDomain.organizationId;
};
exports.default = verifyDomain;
