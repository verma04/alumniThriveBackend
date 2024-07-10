import { GraphQLError } from 'graphql'
import {
    emailLoginInput,
    googleLogin,
    googleLoginInput,
    profileCreationInput,
} from '../../ts-types/types'
import { db } from '../../../../@drizzle'
import { and, eq } from 'drizzle-orm'
import {
    aboutAlumni,
    alumni,
    alumniProfile,
    alumniToOrganization,
} from '../../../../@drizzle/src/db/schema'
import generateJwtToken from '../../utils/generateJwtToken.utils'
import checkAuth from '../../utils/auth/checkAuth.utils'

import verifyDomain from '../../../commanUtils/verifyDomain'
import sendOtp from '../../utils/sendOtp.utils'
import { decryptOtp } from '../../utils/crypto/otp.crypto'
const Cryptr = require('cryptr')
const cryptr = new Cryptr('myTotallySecretKey', {
    encoding: 'base64',
    pbkdf2Iterations: 10,
    saltLength: 5,
})
const loginResolvers = {
    Query: {
        async checkDomain(_: any, { input }: any, context: any) {
            try {
                const findDomain = await db.query.domain.findFirst({
                    where: (user, { eq }) => eq(user.domain, input.domain),
                })

                if (findDomain) {
                    return new GraphQLError(
                        'Sorry, that domain already exists. Please try a different one.',
                        {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        }
                    )
                }
                return {
                    success: true,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async checkOrganization(_: any, { token }: any, context: any) {
            try {
                const decrypted = await cryptr.decrypt(token)

                const parse = await JSON.parse(decrypted)

                const domain = await verifyDomain(parse.origin)

                const findOrg = await db.query.organization.findFirst({
                    where: (organization, { eq }) =>
                        eq(organization.id, domain),
                    with: {
                        theme: true,
                    },
                })

                if (!findOrg) {
                    return new GraphQLError('No Domain Found', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 403 },
                        },
                    })
                }
                return findOrg
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getUser(_: any, {}: any, context: any) {
            try {
                const data = await checkAuth(context)

                const check = await db.query.alumni.findFirst({
                    where: (user, { eq }) => eq(user.id, data.id),
                })

                const profileInfo = await db.query.alumniProfile.findFirst({
                    where: (info, { eq }) => eq(info.alumniId, data.id),
                })

                if (profileInfo) {
                    return {
                        firstName: check.firstName,
                        lastName: check.lastName,
                        email: check.email,
                        id: check?.id,
                        isProfileCompleted: true,
                    }
                } else {
                    return {
                        firstName: check.firstName,
                        lastName: check.lastName,
                        email: check.email,
                        id: check?.id,
                        isProfileCompleted: false,
                    }
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async checkOtpDetails(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const profileInfo = await db.query.userOtp.findFirst({
                    where: (info, { eq }) => eq(info.id, input.id),
                    with: {
                        user: true,
                    },
                })
                console.log(profileInfo)
                return profileInfo.user
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async loginByGoogle(_: any, { input }: googleLoginInput, context: any) {
            try {
                const { name, avatar, googleId, email } = input

                const domain = await verifyDomain(input.domain)

                const user = await db.query.alumni.findFirst({
                    where: (user, { eq }) => eq(user.email, email),
                })

                const loginType = 'google'

                if (user) {
                    const data = await generateOrganizationAlumniProfile(
                        user.id,
                        domain
                    )

                    const generate = await generateJwtToken(user)

                    return {
                        token: generate,
                    }
                }

                if (!user) {
                    const data = await db
                        .insert(alumni)
                        .values({
                            avatar,
                            googleId,
                            email,
                            firstName: name,
                            lastName: '',
                            loginType,
                        })
                        .returning()
                    console.log(data)

                    await generateOrganizationAlumniProfile(data[0].id, domain)

                    const generateToken = await generateJwtToken(data[0])

                    return {
                        token: generateToken,
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },

        async createProfile(
            _: any,
            { input }: profileCreationInput,
            context: any
        ) {
            try {
                const data = await checkAuth(context)
                const { profile, about, education, experience } = input

                const set = await db
                    .update(alumni)
                    .set({
                        firstName: profile.fistName,
                        lastName: profile.lastName,
                    })
                    .where(eq(alumni.id, data.id))
                    .returning()

                const id = set[0].id

                const set2 = await db
                    .insert(alumniProfile)
                    .values({
                        country: profile.country,
                        language: profile.language,
                        DOB: profile.DOB,
                        alumniId: id,
                        phone: profile.phone,
                        experience,
                        education,
                    })
                    .returning()
                console.log(set2)

                await db.insert(aboutAlumni).values({
                    currentPosition: about.currentPosition,
                    linkedin: about.linkedin,
                    instagram: about.instagram,
                    portfolio: about.portfolio,
                    alumniId: id,
                })
                return {
                    status: true,
                }
            } catch (error) {
                console.log(error)
            }
        },

        async loginByEmail(_: any, { input }: emailLoginInput, context: any) {
            try {
                const { email } = input

                const domain = await verifyDomain(input.domain)

                const user = await db.query.alumni.findFirst({
                    where: (user, { eq }) => eq(user.email, email),
                })

                const loginType = 'email'

                if (user) {
                    await generateOrganizationAlumniProfile(user.id, domain)

                    return sendOtp(user)
                }
                if (!user) {
                    const data = await db
                        .insert(alumni)
                        .values({
                            email,
                            firstName: '',
                            lastName: '',
                            loginType,
                        })
                        .returning()

                    return sendOtp(data[0])
                }
            } catch (error) {
                console.log(error)
            }
        },
        async loginByOtp(_: any, { input }: any, context: any) {
            try {
                try {
                    const { otp, id } = input
                    const check = await db.query.userOtp.findFirst({
                        where: (otp, { eq }) => eq(otp.id, id),
                    })

                    if (!check) {
                        return new GraphQLError('Otp Expired', {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        })
                    } else {
                        const decryptedOtp = await decryptOtp(check.otp)
                        if (decryptedOtp !== otp) {
                            return new GraphQLError('Invalid Otp', {
                                extensions: {
                                    code: 'NOT FOUND',
                                    http: { status: 400 },
                                },
                            })
                        }

                        const user = await db.query.alumni.findFirst({
                            where: (user, { eq }) => eq(user.id, check.user),
                        })

                        const generate = await generateJwtToken(user)
                        return {
                            token: generate,
                        }
                    }
                } catch (error) {
                    console.log(error)
                    if (error.code === '22P02') {
                        console.log(error.code)
                        throw new GraphQLError('Otp Expired', {
                            extensions: {
                                code: 'NOT FOUND',
                                http: { status: 400 },
                            },
                        })
                    } else {
                        throw new GraphQLError('Something went wrong', {
                            extensions: {
                                code: 'SOMETHING WENT WRONG',
                                http: { status: 400 },
                            },
                        })
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
}

export { loginResolvers }

async function generateOrganizationAlumniProfile(alumniId, organizationId) {
    const check = await db.query.alumniToOrganization.findFirst({
        where: (alumni, { eq }) =>
            and(
                eq(alumni.alumniId, alumniId),
                eq(alumni.organizationId, organizationId)
            ),
    })

    if (check) {
        return check
    } else {
        const data = await db
            .insert(alumniToOrganization)
            .values({
                alumniId,
                organizationId,
            })
            .returning()

        return data
    }
}
