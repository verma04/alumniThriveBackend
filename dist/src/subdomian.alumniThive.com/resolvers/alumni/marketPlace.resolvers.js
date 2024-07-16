"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketPlaceResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const uploadImageToFolder_utils_1 = __importDefault(require("../../../tenant/admin/utils/upload/uploadImageToFolder.utils"));
const generateSlug_1 = __importDefault(require("../../utils/slug/generateSlug"));
const graphql_1 = require("graphql");
const marketPlaceResolvers = {
    Query: {
        async getAllMarketPlaceListing(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const list = await _drizzle_1.db.query.marketPlace.findMany({
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    where: (marketPlace, { eq }) => eq(marketPlace.organization, org_id),
                    with: {
                        images: true,
                        postedBy: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                });
                console.log(list);
                return list;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async postListing(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                // console.log(input);
                const images = await (0, uploadImageToFolder_utils_1.default)(`${org_id}/marketPlace`, input.images);
                let slug = (0, generateSlug_1.default)(input?.title);
                const findListing = await _drizzle_1.db.query.marketPlace.findFirst({
                    where: (marketPlace, { eq }) => eq(marketPlace.slug, slug),
                });
                if (findListing) {
                    const val = Math.floor(1000 + Math.random() * 9000);
                    slug = slug + '-' + val;
                }
                const addListing = await _drizzle_1.db
                    .insert(schema_1.marketPlace)
                    .values({
                    postedBy: id,
                    organization: org_id,
                    condition: input.condition,
                    sku: input.sku,
                    price: input.price,
                    title: input.title,
                    description: input.description,
                    location: input.location,
                    currency: input.currency,
                    slug,
                })
                    .returning();
                const upload = images.map((set) => ({
                    url: set.file,
                    marketPlace: addListing[0].id,
                }));
                if (upload.length > 0) {
                    await _drizzle_1.db.insert(schema_1.marketPlaceImages).values(upload);
                }
                const list = await _drizzle_1.db.query.marketPlace.findMany({
                    where: (marketPlace, { eq }) => eq(marketPlace.id, addListing[0].id),
                    with: {
                        images: true,
                    },
                });
                return list;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async contactMarketPlace(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                console.log(input);
                if (id === input.userId) {
                    return new graphql_1.GraphQLError('Action not Allowed', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const checkChat = await _drizzle_1.db.query.chat.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.chat.user1, input.userId), (0, drizzle_orm_1.eq)(schema_1.chat.user1, id)), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.chat.user2, id), (0, drizzle_orm_1.eq)(schema_1.chat.user2, input.userId))),
                });
                if (checkChat) {
                    console.log(checkChat);
                    const newChat = await _drizzle_1.db
                        .insert(schema_1.messages)
                        .values({
                        chatId: checkChat.id,
                        content: 'Information of this listing',
                        senderId: id,
                        marketPlace: input.listingId,
                        messageType: 'marketPlace',
                    })
                        .returning();
                    const details = await _drizzle_1.db.query.messages.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.id, newChat[0].id)),
                        with: {
                            sender: true,
                        },
                    });
                    return checkChat;
                }
                const newChat = await _drizzle_1.db
                    .insert(schema_1.chat)
                    .values({
                    user1: id,
                    user2: input.userID,
                })
                    .returning();
                console.log(newChat);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.marketPlaceResolvers = marketPlaceResolvers;
