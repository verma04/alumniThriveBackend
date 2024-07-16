"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const domianCheck_1 = __importDefault(require("../../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const uniqueSlug = require('unique-slug');
const categoryResolvers = {
    Query: {
        async getAllMentorCategory(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(org_id);
                const set = await _drizzle_1.db.query.mentorshipCategory.findMany({
                    where: (mentorshipCategory, { eq }) => eq(mentorshipCategory.organization, org_id),
                    orderBy: (mentorshipCategory, { desc }) => [
                        desc(mentorshipCategory.createdAt),
                    ],
                    with: {
                        mentorShip: true,
                    },
                });
                return set.map((set) => ({
                    id: set.id,
                    title: set.title,
                    count: set.mentorShip.length,
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllMentorSkills(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(org_id);
                const set = await _drizzle_1.db.query.mentorshipSkills.findMany({
                    where: (mentorshipSkills, { eq }) => eq(mentorshipSkills.organization, org_id),
                    orderBy: (mentorshipSkills, { desc }) => [
                        desc(mentorshipSkills.createdAt),
                    ],
                });
                return set.map((set) => ({
                    id: set.id,
                    title: set.title,
                    count: 1,
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async checkMentorShip(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const find = await await _drizzle_1.db.query.mentorShip.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorShip.user, data.id), (0, drizzle_orm_1.eq)(schema_1.mentorShip.organization, org_id)),
                });
                console.log(find);
                if (find) {
                    return {
                        ...find,
                        isRequested: true,
                    };
                }
                else {
                    return {
                        isRequested: false,
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async checkMentorShipUrl(_, {}, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async registerMentorShip(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const randomSlug = uniqueSlug();
                const org_id = await (0, domianCheck_1.default)(context);
                const availability = [
                    {
                        name: 'Monday',
                        isDisabled: false,
                    },
                    {
                        name: 'Tuesday',
                        isDisabled: false,
                    },
                    {
                        name: 'Wednesday',
                        isDisabled: false,
                    },
                    {
                        name: 'Thursday',
                        isDisabled: false,
                    },
                    {
                        name: 'Friday',
                        isDisabled: false,
                    },
                    {
                        name: 'Saturday',
                        isDisabled: false,
                    },
                    {
                        name: 'Sunday',
                        isDisabled: false,
                    },
                ];
                const createMentorShipProfile = await _drizzle_1.db
                    .insert(schema_1.mentorShip)
                    .values({
                    mentorshipCategory: input.category,
                    organization: org_id,
                    displayName: input.displayName,
                    isApproved: false,
                    slug: randomSlug,
                    featuredArticle: input.featuredArticle,
                    intro: input.intro,
                    whyDoWantBecomeMentor: input.whyDoWantBecomeMentor,
                    greatestAchievement: input.greatestAchievement,
                    introVideo: input.introVideo,
                    about: input.about,
                    user: data.id,
                    availability,
                    agreement: input.agreement,
                })
                    .returning();
                console.log(createMentorShipProfile);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.categoryResolvers = categoryResolvers;
