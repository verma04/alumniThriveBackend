"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issuesResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../../utils/auth/checkAuth.utils"));
const domianCheck_1 = __importDefault(require("../../../../commanUtils/domianCheck"));
const schema_1 = require("../../../../@drizzle/src/db/schema");
const filterConditions = (org_id, search) => {
    const conditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.issues.organization, org_id), (0, drizzle_orm_1.and)(!search || search?.length === 0
        ? (0, drizzle_orm_1.not)((0, drizzle_orm_1.ilike)(schema_1.issues.title, `%${null}%`))
        : (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.issues.title, `%${search}%`))));
    return conditions;
};
const issuesResolvers = {
    Query: {
        async getIssues(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const { search, offset, limit, sort } = input;
                const conditions = filterConditions(org_id, search);
                const totalRecords = await _drizzle_1.db
                    .select({ count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number) })
                    .from(schema_1.issues)
                    .where(conditions);
                const paginatedData = await _drizzle_1.db
                    .select({
                    issues: schema_1.issues,
                    user: schema_1.alumni,
                    // comment: count(issueComment.issue),
                })
                    .from(schema_1.issues)
                    .leftJoin(schema_1.alumni, (0, drizzle_orm_1.eq)(schema_1.issues.user, schema_1.alumni.id))
                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(9)
                    .orderBy((0, drizzle_orm_1.desc)(schema_1.issues.createdAt));
                console.log(paginatedData);
                return {
                    totalRecords: totalRecords[0].count,
                    data: paginatedData.map((set) => ({
                        ...set?.issues,
                        // comments: set.comment,
                        user: {
                            id: set.user.id,
                            firstName: set.user.firstName,
                            lastName: set.user.lastName,
                        },
                    })),
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getIssueBySlug(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const issue = await _drizzle_1.db.query.issues.findFirst({
                    where: (issue, { eq }) => (0, drizzle_orm_1.and)(eq(issue.organization, org_id), eq(issue.ticket, input.id)),
                });
                return issue;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getIssueComment(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input);
                const find = await _drizzle_1.db.query.issues.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.issues.id, input.id)),
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
                console.log(find);
                return find.comment;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async createIssue(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const issue = await _drizzle_1.db.query.issues.findMany({
                    where: (issue, { eq }) => (0, drizzle_orm_1.and)(eq(issue.organization, org_id)),
                });
                const createIssues = await _drizzle_1.db
                    .insert(schema_1.issues)
                    .values({
                    visibility: input.visibility,
                    title: input.title,
                    summary: input.summary,
                    page: input.page,
                    details: input.details,
                    module: input.module,
                    feature: input.feature,
                    organization: org_id,
                    user: data.id,
                    ticket: issue.length + 1,
                    type: input.type,
                })
                    .returning();
                console.log(createIssues);
                return createIssues;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addIssueComment(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const feed = await _drizzle_1.db
                    .insert(schema_1.issueComment)
                    .values({
                    issue: input.feedId,
                    content: input.content,
                    user: id,
                })
                    .returning();
                return feed;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.issuesResolvers = issuesResolvers;
