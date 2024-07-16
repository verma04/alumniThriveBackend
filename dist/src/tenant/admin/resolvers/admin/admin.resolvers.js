"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminResolvers = void 0;
const _drizzle_1 = require("../../../../@drizzle");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendOtp_utils_1 = __importDefault(require("../../utils/sendOtp.utils"));
const otp_crypto_1 = require("../../utils/crypto/otp.crypto");
const generateJwtToken_utils_1 = __importDefault(require("../../utils/generateJwtToken.utils"));
const checkmail_utils_1 = require("../../utils/mail/checkmail.utils");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const drizzle_orm_1 = require("drizzle-orm");
const welcomeEmail_queue_1 = __importDefault(require("../../../../queue/welcomeEmail.queue"));
const adminResolvers = {
    Query: {
        async getUser(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const token = context.headers?.authorization;
                const check = await _drizzle_1.db.query.loginSession.findFirst({
                    where: (session, { eq }) => (0, drizzle_orm_1.and)(eq(session.token, token), eq(session.logout, false)),
                });
                if (!check) {
                    return new graphql_1.GraphQLError('Session Expired', {
                        extensions: {
                            code: 403,
                            http: { status: 403 },
                        },
                    });
                }
                else {
                    return {
                        status: true,
                        id: data.id,
                    };
                }
                console.log(check);
            }
            catch (error) {
                throw error;
            }
        },
        async userProfile(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const user = await _drizzle_1.db.query.users.findFirst({
                    where: (session, { eq }) => eq(session.id, data.id),
                });
                return user;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        async logoutUser(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const token = context.headers?.authorization;
                await _drizzle_1.db
                    .update(schema_1.loginSession)
                    .set({ logout: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.loginSession.token, token));
                return {
                    success: true,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async logoutUserAllDevices(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await _drizzle_1.db
                    .update(schema_1.loginSession)
                    .set({ logout: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.loginSession.userId, data.id));
                return {
                    success: true,
                };
            }
            catch (error) {
                throw error;
            }
        },
        async registerAsAdmin(_, { input }, context) {
            try {
                const { password, firstName, lastName, email } = input;
                const checkMail = await (0, checkmail_utils_1.checkEmail)(email);
                if (checkMail) {
                    return new graphql_1.GraphQLError('Kindly provide your official email address', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                const hashPassword = await bcrypt_1.default.hash(password, 10);
                const data = await _drizzle_1.db
                    .insert(schema_1.users)
                    .values({
                    password: hashPassword,
                    firstName,
                    lastName,
                    email,
                })
                    .returning();
                (0, welcomeEmail_queue_1.default)(email, `${firstName} ${lastName}`);
                return {
                    success: true,
                };
            }
            catch (error) {
                if (error.code === '23505') {
                    throw new graphql_1.GraphQLError('An email with this address already exists. Please try another one', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                else {
                    throw new graphql_1.GraphQLError('Something went wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
            }
        },
        async loginAsAdmin(_, { input }, context) {
            try {
                const { email, password } = input;
                const check = await _drizzle_1.db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.email, email),
                });
                if (!check) {
                    return new graphql_1.GraphQLError('Email Not Found', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    });
                }
                else {
                    const comparePassword = await bcrypt_1.default.compare(password, check?.password);
                    if (!comparePassword) {
                        return new graphql_1.GraphQLError('Wrong credentials', {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        });
                    }
                    return (0, sendOtp_utils_1.default)(check);
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async otpLogin(_, { input }, context) {
            try {
                const { otp, id } = input;
                const check = await _drizzle_1.db.query.otp.findFirst({
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
                    const jwt = await (0, generateJwtToken_utils_1.default)(check);
                    const createLoginSession = await _drizzle_1.db
                        .insert(schema_1.loginSession)
                        .values({ userId: check.userId, token: jwt })
                        .returning();
                    console.log(createLoginSession);
                    return createLoginSession[0];
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
        },
    },
};
exports.adminResolvers = adminResolvers;
