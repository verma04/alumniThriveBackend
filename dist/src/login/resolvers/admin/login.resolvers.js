"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginResolvers = void 0;
const graphql_1 = require("graphql");
const _drizzle_1 = require("../../../@drizzle");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../@drizzle/src/db/schema");
const generateJwtToken_utils_1 = __importDefault(require("../../utils/generateJwtToken.utils"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const verifyDomain_1 = __importDefault(require("../../../commanUtils/verifyDomain"));
const sendOtp_utils_1 = __importDefault(require("../../utils/sendOtp.utils"));
const otp_crypto_1 = require("../../utils/crypto/otp.crypto");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey', {
    encoding: 'base64',
    pbkdf2Iterations: 10,
    saltLength: 5,
});
const loginResolvers = {
    Query: {
        async checkDomain(_, { input }, context) {
            try {
                const findDomain = await _drizzle_1.db.query.domain.findFirst({
                    where: (user, { eq }) => eq(user.domain, input.domain),
                });
                if (findDomain) {
                    return new graphql_1.GraphQLError('Sorry, that domain already exists. Please try a different one.', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                return {
                    success: true,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async checkOrganization(_, { token }, context) {
            try {
                const decrypted = await cryptr.decrypt(token);
                const parse = await JSON.parse(decrypted);
                const domain = await (0, verifyDomain_1.default)(parse.origin);
                const findOrg = await _drizzle_1.db.query.organization.findFirst({
                    where: (organization, { eq }) => eq(organization.id, domain),
                    with: {
                        theme: true,
                    },
                });
                if (!findOrg) {
                    return new graphql_1.GraphQLError('No Domain Found', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 403 },
                        },
                    });
                }
                return findOrg;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getUser(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const check = await _drizzle_1.db.query.alumni.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                });
                const profileInfo = await _drizzle_1.db.query.alumniProfile.findFirst({
                    where: (info, { eq }) => eq(info.alumniId, data.id),
                });
                if (profileInfo) {
                    return {
                        firstName: check.firstName,
                        lastName: check.lastName,
                        email: check.email,
                        id: check?.id,
                        isProfileCompleted: true,
                    };
                }
                else {
                    return {
                        firstName: check.firstName,
                        lastName: check.lastName,
                        email: check.email,
                        id: check?.id,
                        isProfileCompleted: false,
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async checkOtpDetails(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const profileInfo = await _drizzle_1.db.query.userOtp.findFirst({
                    where: (info, { eq }) => eq(info.id, input.id),
                    with: {
                        user: true,
                    },
                });
                console.log(profileInfo);
                return profileInfo.user;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async loginByGoogle(_, { input }, context) {
            try {
                const { name, avatar, googleId, email } = input;
                const domain = await (0, verifyDomain_1.default)(input.domain);
                const user = await _drizzle_1.db.query.alumni.findFirst({
                    where: (user, { eq }) => eq(user.email, email),
                });
                const loginType = 'google';
                if (user) {
                    const data = await generateOrganizationAlumniProfile(user.id, domain);
                    const generate = await (0, generateJwtToken_utils_1.default)(user);
                    return {
                        token: generate,
                    };
                }
                if (!user) {
                    const data = await _drizzle_1.db
                        .insert(schema_1.alumni)
                        .values({
                        avatar,
                        googleId,
                        email,
                        firstName: name,
                        lastName: '',
                        loginType,
                    })
                        .returning();
                    console.log(data);
                    await generateOrganizationAlumniProfile(data[0].id, domain);
                    const generateToken = await (0, generateJwtToken_utils_1.default)(data[0]);
                    return {
                        token: generateToken,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async createProfile(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const { profile, about, education, experience } = input;
                const set = await _drizzle_1.db
                    .update(schema_1.alumni)
                    .set({
                    firstName: profile.fistName,
                    lastName: profile.lastName,
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.alumni.id, data.id))
                    .returning();
                const id = set[0].id;
                const set2 = await _drizzle_1.db
                    .insert(schema_1.alumniProfile)
                    .values({
                    country: profile.country,
                    language: profile.language,
                    DOB: profile.DOB,
                    alumniId: id,
                    phone: profile.phone,
                    experience,
                    education,
                })
                    .returning();
                console.log(set2);
                await _drizzle_1.db.insert(schema_1.aboutAlumni).values({
                    currentPosition: about.currentPosition,
                    linkedin: about.linkedin,
                    instagram: about.instagram,
                    portfolio: about.portfolio,
                    alumniId: id,
                });
                return {
                    status: true,
                };
            }
            catch (error) {
                console.log(error);
            }
        },
        async loginByEmail(_, { input }, context) {
            try {
                const { email } = input;
                const domain = await (0, verifyDomain_1.default)(input.domain);
                const user = await _drizzle_1.db.query.alumni.findFirst({
                    where: (user, { eq }) => eq(user.email, email),
                });
                const loginType = 'email';
                if (user) {
                    await generateOrganizationAlumniProfile(user.id, domain);
                    return (0, sendOtp_utils_1.default)(user);
                }
                if (!user) {
                    const data = await _drizzle_1.db
                        .insert(schema_1.alumni)
                        .values({
                        email,
                        firstName: '',
                        lastName: '',
                        loginType,
                    })
                        .returning();
                    return (0, sendOtp_utils_1.default)(data[0]);
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async loginByOtp(_, { input }, context) {
            try {
                try {
                    const { otp, id } = input;
                    const check = await _drizzle_1.db.query.userOtp.findFirst({
                        where: (otp, { eq }) => eq(otp.id, id),
                    });
                    if (!check) {
                        return new graphql_1.GraphQLError('Otp Expired', {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        });
                    }
                    else {
                        const decryptedOtp = await (0, otp_crypto_1.decryptOtp)(check.otp);
                        if (decryptedOtp !== otp) {
                            return new graphql_1.GraphQLError('Invalid Otp', {
                                extensions: {
                                    code: 'NOT FOUND',
                                    http: { status: 400 },
                                },
                            });
                        }
                        const user = await _drizzle_1.db.query.alumni.findFirst({
                            where: (user, { eq }) => eq(user.id, check.user),
                        });
                        const generate = await (0, generateJwtToken_utils_1.default)(user);
                        return {
                            token: generate,
                        };
                    }
                }
                catch (error) {
                    console.log(error);
                    if (error.code === '22P02') {
                        console.log(error.code);
                        throw new graphql_1.GraphQLError('Otp Expired', {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        });
                    }
                    else {
                        throw new graphql_1.GraphQLError('Something went wrong', {
                            extensions: {
                                code: 'SOMETHING WENT WRONG',
                                http: { status: 400 },
                            },
                        });
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        },
    },
};
exports.loginResolvers = loginResolvers;
async function generateOrganizationAlumniProfile(alumniId, organizationId) {
    const check = await _drizzle_1.db.query.alumniToOrganization.findFirst({
        where: (alumni, { eq }) => (0, drizzle_orm_1.and)(eq(alumni.alumniId, alumniId), eq(alumni.organizationId, organizationId)),
    });
    if (check) {
        return check;
    }
    else {
        const data = await _drizzle_1.db
            .insert(schema_1.alumniToOrganization)
            .values({
            alumniId,
            organizationId,
        })
            .returning();
        return data;
    }
}
