import { and, count, desc, eq, ilike, not, or, sql } from 'drizzle-orm'
import { db } from '../../../../../@drizzle'
import checkAuth from '../../../utils/auth/checkAuth.utils'
import domainCheck from '../../../../commanUtils/domianCheck'
import {
    alumni,
    issueComment,
    issues,
} from '../../../../../@drizzle/src/db/schema'

const filterConditions = (org_id, search) => {
    const conditions = and(
        eq(issues.organization, org_id),

        and(
            !search || search?.length === 0
                ? not(ilike(issues.title, `%${null}%`))
                : or(ilike(issues.title, `%${search}%`))
        )
    )
    return conditions
}
const issuesResolvers = {
    Query: {
        async getIssues(_: any, { input }: any, context: any) {
            try {
                await checkAuth(context)

                const org_id = await domainCheck(context)

                const { search, offset, limit, sort } = input

                const conditions = filterConditions(org_id, search)

                const totalRecords = await db
                    .select({ count: sql`count(*)`.mapWith(Number) })
                    .from(issues)
                    .where(conditions)

                const paginatedData = await db
                    .select({
                        issues: issues,
                        user: alumni,
                        // comment: count(issueComment.issue),
                    })
                    .from(issues)
                    .leftJoin(alumni, eq(issues.user, alumni.id))

                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(9)
                    .orderBy(desc(issues.createdAt))

                console.log(paginatedData)

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
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getIssueBySlug(_: any, { input }: any, context: any) {
            try {
                await checkAuth(context)
                const org_id = await domainCheck(context)
                const issue = await db.query.issues.findFirst({
                    where: (issue, { eq }) =>
                        and(
                            eq(issue.organization, org_id),
                            eq(issue.ticket, input.id)
                        ),
                })
                return issue
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getIssueComment(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                console.log(input)

                const find = await db.query.issues.findFirst({
                    where: and(eq(issues.id, input.id)),
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
                })
                console.log(find)

                return find.comment
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async createIssue(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                const org_id = await domainCheck(context)

                const issue = await db.query.issues.findMany({
                    where: (issue, { eq }) =>
                        and(eq(issue.organization, org_id)),
                })

                const createIssues = await db
                    .insert(issues)
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
                    .returning()
                console.log(createIssues)

                return createIssues
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addIssueComment(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const feed = await db
                    .insert(issueComment)
                    .values({
                        issue: input.feedId,
                        content: input.content,
                        user: id,
                    })
                    .returning()

                return feed
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { issuesResolvers }
