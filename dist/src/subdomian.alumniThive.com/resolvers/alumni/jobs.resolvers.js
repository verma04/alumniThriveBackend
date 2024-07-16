"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobsResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const slugify_1 = __importDefault(require("slugify"));
const generateSlug_utils_1 = __importDefault(require("../../../tenant/admin/utils/slug/generateSlug.utils"));
const jobsResolvers = {
    Query: {
        async getAllJobs(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const allJobs = await _drizzle_1.db.query.jobs.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobs.organization, org_id)),
                    with: {
                        postedBy: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return allJobs;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getJobPostedByMe(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const allJobs = await _drizzle_1.db.query.jobs.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobs.postedBy, id), (0, drizzle_orm_1.eq)(schema_1.jobs.organization, org_id)),
                    with: {
                        postedBy: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                console.log(allJobs);
                return allJobs;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getJobBySlug(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const job = await _drizzle_1.db.query.jobs.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobs.slug, input.slug), (0, drizzle_orm_1.eq)(schema_1.jobs.organization, org_id)),
                    with: {
                        postedBy: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return job;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async postJob(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                let slug = (0, slugify_1.default)(input.jobTitle, {
                    replacement: '-',
                    remove: /[*+~.()'"!:,@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                });
                const findJobs = await _drizzle_1.db.query.jobs.findFirst({
                    where: (jobs, { eq }) => eq(jobs.slug, slug),
                });
                if (findJobs) {
                    const val = Math.floor(1000 + Math.random() * 9000);
                    slug = slug + '-' + val;
                }
                const addedJobs = await _drizzle_1.db
                    .insert(schema_1.jobs)
                    .values({
                    ...input,
                    organization: org_id,
                    postedBy: id,
                    slug,
                })
                    .returning();
                const createFeed = await _drizzle_1.db
                    .insert(schema_1.alumniFeed)
                    .values({
                    alumniId: id,
                    organization: org_id,
                    description: 'New Job Added',
                    jobs: addedJobs[0].id,
                    feedForm: 'jobs',
                })
                    .returning();
                console.log(createFeed);
                return addedJobs;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async duplicateJob(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const slug = await (0, generateSlug_utils_1.default)();
                const form = await _drizzle_1.db.query.jobs.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobs.id, input.id)),
                });
                const duplicateJob = await _drizzle_1.db
                    .insert(schema_1.jobs)
                    .values({
                    postedBy: form.postedBy,
                    organization: form.organization,
                    jobTitle: `${form.jobTitle}-copy-1`,
                    jobType: form.jobType,
                    company: form.company,
                    salary: form.salary,
                    slug,
                    description: form.description,
                    location: form.location,
                    workplaceType: form.workplaceType,
                    experience: form.experience,
                    tag: form.tag,
                })
                    .returning();
                return duplicateJob;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async applyJob(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input.id);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.jobsResolvers = jobsResolvers;
