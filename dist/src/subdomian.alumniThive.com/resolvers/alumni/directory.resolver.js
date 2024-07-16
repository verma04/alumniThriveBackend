"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directoryResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const graphql_1 = require("graphql");
const directoryResolvers = {
    Query: {
        async getAllDirectory(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await _drizzle_1.db.query.alumniToOrganization.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, id)),
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
                });
                const find = await _drizzle_1.db.query.alumniToOrganization.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.organizationId, org_id), (0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.isApproved, true)),
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
                });
                const excludeUser = find.filter((set) => set.alumniId !== id);
                const re = excludeUser.map((set) => ({
                    id: set.alumniId,
                    firstName: set.alumni.firstName,
                    lastName: set.alumni.lastName,
                    avatar: set.alumni.avatar,
                    aboutAlumni: set.alumni.aboutAlumni,
                    isFollowing: set?.following.find((dind) => dind.followerId === user.alumniId)
                        ? true
                        : false,
                    isRequestedUser: {
                        isRequested: set?.requestReceive.find((dind) => dind.userId === user.alumniId)
                            ? true
                            : false,
                        isAccepted: set?.requestReceive.find((dind) => dind.userId === user.alumniId)?.isAccepted,
                    },
                    isConnectIonRequested: {
                        isFollower: set?.requestSent?.find((set) => set?.senderId === id)?.isAccepted,
                        isConnection: set?.requestSent?.find((set) => set?.senderId === id)
                            ? true
                            : false,
                    },
                }));
                // console.log(re);
                return re;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getUserDetails(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const user = await _drizzle_1.db.query.alumniToOrganization.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, input.id)),
                    with: {
                        alumni: {
                            with: {
                                aboutAlumni: true,
                            },
                        },
                    },
                });
                return { ...user.alumni, myProfile: input.id === id };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async connectToUser(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                if (input.id === id) {
                    return new graphql_1.GraphQLError('SomeThing went Wrong, Please try agin after some Time', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const isReadyFollowingUser = await _drizzle_1.db.query.alumniConnection.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniConnection.followingId, id), (0, drizzle_orm_1.eq)(schema_1.alumniConnection.followerId, input.id)),
                });
                if (!isReadyFollowingUser) {
                    await _drizzle_1.db
                        .insert(schema_1.alumniConnection)
                        .values({
                        followingId: id, // user will bucket will show request user as follower
                        followerId: input.id,
                        isAccepted: true,
                    })
                        .returning();
                }
                await _drizzle_1.db
                    .insert(schema_1.alumniRequest)
                    .values({
                    senderId: id,
                    userId: input.id,
                    isAccepted: false,
                })
                    .returning();
                // // console.log(set, set2);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async acceptConnectionRequest(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                if (input.id === id) {
                    return new graphql_1.GraphQLError('SomeThing went Wrong, Please try agin after some Time', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const find = await _drizzle_1.db.query.alumniRequest.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniRequest.userId, id), (0, drizzle_orm_1.eq)(schema_1.alumniRequest.senderId, input.id)),
                });
                if (!find) {
                    return new graphql_1.GraphQLError('No Request Found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                if (input.accept) {
                    const set = await _drizzle_1.db
                        .insert(schema_1.alumniConnection)
                        .values({
                        followingId: id, // user will bucket will show request user as follower
                        followerId: input.id,
                        isAccepted: true,
                    })
                        .returning();
                }
                if (!input.accept) {
                    await _drizzle_1.db
                        .delete(schema_1.alumniRequest)
                        .where((0, drizzle_orm_1.eq)(schema_1.alumniRequest.id, find.id));
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
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.directoryResolvers = directoryResolvers;
