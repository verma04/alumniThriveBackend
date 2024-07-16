"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const schema_1 = require("../../../@drizzle/src/db/schema");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const uploadFeedImage_utils_1 = __importDefault(require("../../../tenant/admin/utils/upload/uploadFeedImage.utils"));
const feedResolvers = {
    Query: {
        async getGroupFeed(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.alumniFeed.findMany({
                    where: (d, { eq }) => eq(d.groupId, input.id),
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.alumniFeed.createdAt)],
                    limit: 10,
                    offset: input.offset,
                    with: {
                        media: true,
                        reactions: {
                            with: {
                                alumni: {
                                    with: {
                                        alumni: {
                                            with: {
                                                aboutAlumni: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                });
                const feed = await find.map((t) => ({
                    id: t.id,
                    description: t.description,
                    media: t.media,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }));
                return feed;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllAlumniFeed(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.alumniFeed.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniFeed.alumniId, id), (0, drizzle_orm_1.eq)(schema_1.alumniFeed.organization, org_id), (0, drizzle_orm_1.eq)(schema_1.alumniFeed.feedForm, 'group')),
                    with: {
                        reactions: {
                            with: {
                                alumni: {
                                    with: {
                                        alumni: {
                                            with: {
                                                aboutAlumni: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        group: true,
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                });
                const feed = await find.map((t) => ({
                    id: t.id,
                    description: t.description,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    feedForm: t.feedForm,
                    job: t.jobs,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }));
                return feed;
                // return { ...find, privacy: find?.setting?.privacy };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllUserFeed(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.alumniFeed.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniFeed.organization, org_id)),
                    orderBy: (alumniFeed, { desc }) => [
                        desc(alumniFeed.createdAt),
                    ],
                    with: {
                        media: true,
                        reactions: {
                            with: {
                                alumni: {
                                    with: {
                                        alumni: {
                                            with: {
                                                aboutAlumni: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        group: true,
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                });
                const feed = await find.map((t) => ({
                    id: t.id,
                    media: t.media,
                    description: t.description,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }));
                return feed;
                // return { ...find, privacy: find?.setting?.privacy };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getFeedComment(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input);
                const find = await _drizzle_1.db.query.alumniFeed.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniFeed.id, input.id)),
                    with: {
                        comment: {
                            with: {
                                user: {
                                    with: {
                                        alumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                console.log(find.comment);
                return find.comment;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getGroupFeedByUser(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await _drizzle_1.db.query.alumniFeed.findMany({
                    where: (d, { eq }) => (0, drizzle_orm_1.and)(eq(d.feedForm, 'group'), eq(d.alumniId, id)),
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.alumniFeed.createdAt)],
                    with: {
                        media: true,
                        reactions: {
                            with: {
                                alumni: {
                                    with: {
                                        alumni: {
                                            with: {
                                                aboutAlumni: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                });
                const feed = await find.map((t) => ({
                    id: t.id,
                    description: t.description,
                    media: t.media,
                    createdAt: t.createdAt,
                    user: t?.alumni?.alumni,
                    reactions: t.reactions.map((set) => ({
                        type: set.reactionsType,
                        user: {
                            ...set.alumni.alumni,
                            aboutAlumni: set.alumni.alumni.aboutAlumni,
                        },
                    })),
                }));
                return feed;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addFeedGroup(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const feedImages = await (0, uploadFeedImage_utils_1.default)(org_id, input.image);
                const createFeed = await _drizzle_1.db
                    .insert(schema_1.alumniFeed)
                    .values({
                    description: input.description,
                    alumniId: id,
                    feedForm: 'group',
                    groupId: input.groupId,
                    organization: org_id,
                })
                    .returning();
                if (feedImages.length > 0) {
                    const values = await feedImages.map((set) => ({
                        feedId: createFeed[0].id,
                        url: set.file,
                        organization: org_id,
                        alumni: id,
                        groupId: input.groupId,
                    }));
                    console.log(values);
                    const img = await _drizzle_1.db
                        .insert(schema_1.media)
                        .values(values)
                        .returning();
                    console.log(img);
                }
                const find = await _drizzle_1.db.query.alumniFeed.findFirst({
                    where: (d, { eq }) => eq(d.id, createFeed[0].id),
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.alumniFeed.createdAt)],
                    with: {
                        media: true,
                        reactions: {
                            with: {
                                alumni: {
                                    with: {
                                        alumni: {
                                            with: {
                                                aboutAlumni: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                });
                const findGroup = await _drizzle_1.db.query.groups.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.groups.id, input.groupId),
                    with: {
                        member: true,
                        setting: true,
                    },
                });
                await _drizzle_1.db
                    .update(schema_1.groups)
                    .set({ numberOfPost: findGroup.numberOfPost + 1 })
                    .where((0, drizzle_orm_1.eq)(schema_1.groups.id, input.groupId));
                return {
                    id: find.id,
                    description: find.description,
                    createdAt: find.createdAt,
                    user: find?.alumni?.alumni,
                    reactions: find?.reactions?.map((set) => ({
                        type: set?.reactionsType,
                        user: {
                            ...set?.alumni?.alumni,
                            aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
                        },
                    })),
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addFeedComment(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const feed = await _drizzle_1.db
                    .insert(schema_1.feedComment)
                    .values({
                    feed: input.feedId,
                    content: input.content,
                    user: id,
                })
                    .returning();
                console.log(feed);
                return feed;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.feedResolvers = feedResolvers;
