import { and, eq } from 'drizzle-orm'
import { db } from '../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    alumniConnection,
    alumniRequest,
    alumniToOrganization,
} from '../../../@drizzle/src/db/schema'
import { connectInput } from '../../ts-types/directory-types'
import { GraphQLError } from 'graphql'
import { connection } from 'mongoose'

const directoryResolvers = {
    Query: {
        async getAllDirectory(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                const user = await db.query.alumniToOrganization.findFirst({
                    where: and(eq(alumniToOrganization.alumniId, id)),

                    with: {
                        followers: true,
                        following: true,
                        requestSent: true,
                        requestReceive: true,
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                })

                const find = await db.query.alumniToOrganization.findMany({
                    where: and(
                        eq(alumniToOrganization.organizationId, org_id),
                        eq(alumniToOrganization.isApproved, true)
                    ),
                    orderBy: (alumniToOrganization, { desc }) => [
                        desc(alumniToOrganization.createdAt),
                    ],
                    with: {
                        requestSent: true,
                        requestReceive: true,
                        followers: true,
                        following: true,
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                })

                const excludeUser = find.filter((set) => set.alumniId !== id)

                const re = excludeUser.map((set) => ({
                    id: set.alumniId,
                    firstName: set.alumni.firstName,
                    lastName: set.alumni.lastName,
                    avatar: set.alumni.avatar,
                    aboutAlumni: set.alumni.aboutAlumni,

                    isFollowing: set?.following.find(
                        (dind) => dind.followerId === user.alumniId
                    )
                        ? true
                        : false,

                    isRequestedUser: {
                        isRequested: set?.requestReceive.find(
                            (dind) => dind.userId === user.alumniId
                        )
                            ? true
                            : false,
                        isAccepted: set?.requestReceive.find(
                            (dind) => dind.userId === user.alumniId
                        )?.isAccepted,
                    },

                    isConnectIonRequested: {
                        isFollower: set?.requestSent?.find(
                            (set) => set?.senderId === id
                        )?.isAccepted,

                        isConnection: set?.requestSent?.find(
                            (set) => set?.senderId === id
                        )
                            ? true
                            : false,
                    },
                }))

                // console.log(re);
                return re
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getUserDetails(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const user = await db.query.alumniToOrganization.findFirst({
                    where: and(eq(alumniToOrganization.alumniId, input.id)),

                    with: {
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                })

                return { ...user.alumni, myProfile: input.id === id }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async connectToUser(_: any, { input }: connectInput, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                if (input.id === id) {
                    return new GraphQLError(
                        'SomeThing went Wrong, Please try agin after some Time',
                        {
                            extensions: {
                                code: 400,
                                http: { status: 400 },
                            },
                        }
                    )
                }
                const isReadyFollowingUser =
                    await db.query.alumniConnection.findFirst({
                        where: and(
                            eq(alumniConnection.followingId, id),
                            eq(alumniConnection.followerId, input.id)
                        ),
                    })
                if (!isReadyFollowingUser) {
                    await db
                        .insert(alumniConnection)
                        .values({
                            followingId: id, // user will bucket will show request user as follower
                            followerId: input.id,
                            isAccepted: true,
                        })
                        .returning()
                }

                await db
                    .insert(alumniRequest)
                    .values({
                        senderId: id,
                        userId: input.id,
                        isAccepted: false,
                    })
                    .returning()
                // // console.log(set, set2);
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async acceptConnectionRequest(
            _: any,
            { input }: connectInput,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                if (input.id === id) {
                    return new GraphQLError(
                        'SomeThing went Wrong, Please try agin after some Time',
                        {
                            extensions: {
                                code: 400,
                                http: { status: 400 },
                            },
                        }
                    )
                }

                const find = await db.query.alumniRequest.findFirst({
                    where: and(
                        eq(alumniRequest.userId, id),
                        eq(alumniRequest.senderId, input.id)
                    ),
                })

                if (!find) {
                    return new GraphQLError('No Request Found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                if (input.accept) {
                    const set = await db
                        .insert(alumniConnection)
                        .values({
                            followingId: id, // user will bucket will show request user as follower
                            followerId: input.id,
                            isAccepted: true,
                        })
                        .returning()
                }
                if (!input.accept) {
                    await db
                        .delete(alumniRequest)
                        .where(eq(alumniRequest.id, find.id))
                }

                // const set = await db
                //   .insert(alumniConnection)
                //   .values({
                //     followingId: id, // user will bucket will show request user as follower
                //     followerId: input.id,
                //     isAccepted: true,
                //   })
                //   .returning();
                // await db
                //   .insert(alumniRequest)
                //   .values({
                //     senderId: id,
                //     userId: input.id,
                //     isAccepted: false,
                //   })
                //   .returning();
                // // console.log(set, set2);
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { directoryResolvers }
