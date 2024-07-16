import { SQL, and, eq, inArray, sql } from 'drizzle-orm'
import { db } from '../../../../@drizzle'

import checkAuth from '../../utils/auth/checkAuth.utils'

import { userOrg } from './mentorship.resolvers'
import { moduleFaqs } from '../../../../@drizzle/src/db/schema'

const faqResolvers = {
    Query: {
        async getModuleFaq(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const faq = await db.query.moduleFaqs.findMany({
                    where: (moduleFaqs, { eq }) =>
                        and(
                            eq(moduleFaqs.organization, userOrgId),
                            eq(moduleFaqs.faqModule, input.module)
                        ),
                    orderBy: (moduleFaqs, { desc }) => [desc(moduleFaqs.sort)],
                })

                return faq
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
    Mutation: {
        async addFaq(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const { title, description, module } = input

                const faq = await db.query.moduleFaqs.findMany({
                    where: (moduleFaqs, { eq }) =>
                        and(
                            eq(moduleFaqs.organization, userOrgId),
                            eq(moduleFaqs.faqModule, input.module)
                        ),
                    orderBy: (moduleFaqs, { desc }) => [desc(moduleFaqs.sort)],
                })
                const newFaq = await db
                    .insert(moduleFaqs)

                    .values({
                        title,
                        description,
                        faqModule: module,
                        organization: userOrgId,
                        sort: faq.length,
                    })
                    .returning()
                return newFaq
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async editFaq(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)
                await userOrg(data.id)

                const update = await db
                    .update(moduleFaqs)
                    .set({
                        title: input.title,
                        description: input?.description,
                    })
                    .where(eq(moduleFaqs.id, input.id))
                    .returning()
                return update
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteFaq(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const { id } = await checkAuth(context)

                await db.delete(moduleFaqs).where(eq(moduleFaqs.id, id))
                return {
                    id: input.id,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async sortFaq(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                console.log(input)

                if (input.length === 0) {
                    return
                }
                const sqlChunks: SQL[] = []
                const ids: any[] = []
                sqlChunks.push(sql`(case`)
                for (const data of input) {
                    sqlChunks.push(
                        sql`when ${moduleFaqs.id} = ${data.id} then ${Number(data.sort)}`
                    )
                    ids.push(data.id)
                }
                sqlChunks.push(sql`end)`)
                const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '))
                console.log(sqlChunks)
                await db
                    .update(moduleFaqs)
                    .set({ sort: finalSql })
                    .where(inArray(moduleFaqs.id, ids))
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { faqResolvers }
