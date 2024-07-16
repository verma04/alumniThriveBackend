"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _drizzle_1 = require("../../../@drizzle");
const getOrg = async (id) => {
    const org = await _drizzle_1.db.query.loginSession.findFirst({
        where: (loginSession, { eq }) => eq(loginSession.id, id),
    });
    console.log(org);
    const uses = await _drizzle_1.db.query.users.findFirst({
        where: (loginSession, { eq }) => eq(loginSession.id, id),
    });
    console.log(uses);
};
exports.default = getOrg;
