"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../../@drizzle");
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const mentorship_resolvers_1 = require("./mentorship.resolvers");
const schema_1 = require("../../../../@drizzle/src/db/schema");
const faqResolvers = {
    Query: {
        async getModuleFaq(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const faq = await _drizzle_1.db.query.moduleFaqs.findMany({
                    where: (moduleFaqs, { eq }) => (0, drizzle_orm_1.and)(eq(moduleFaqs.organization, userOrgId), eq(moduleFaqs.faqModule, input.module)),
                    orderBy: (moduleFaqs, { desc }) => [desc(moduleFaqs.sort)],
                });
                return faq;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async addFaq(_, { input }, context) {
            try {
                console.log(input);
                const data = await (0, checkAuth_utils_1.default)(context);
                const userOrgId = await (0, mentorship_resolvers_1.userOrg)(data.id);
                const { title, description, module } = input;
                const faq = await _drizzle_1.db.query.moduleFaqs.findMany({
                    where: (moduleFaqs, { eq }) => (0, drizzle_orm_1.and)(eq(moduleFaqs.organization, userOrgId), eq(moduleFaqs.faqModule, input.module)),
                    orderBy: (moduleFaqs, { desc }) => [desc(moduleFaqs.sort)],
                });
                const newFaq = await _drizzle_1.db
                    .insert(schema_1.moduleFaqs)
                    .values({
                    title,
                    description,
                    faqModule: module,
                    organization: userOrgId,
                    sort: faq.length,
                })
                    .returning();
                return newFaq;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async editFaq(_, { input }, context) {
            try {
                const data = await (0, checkAuth_utils_1.default)(context);
                await (0, mentorship_resolvers_1.userOrg)(data.id);
                const update = await _drizzle_1.db
                    .update(schema_1.moduleFaqs)
                    .set({
                    title: input.title,
                    description: input?.description,
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.moduleFaqs.id, input.id))
                    .returning();
                return update;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async deleteFaq(_, { input }, context) {
            try {
                console.log(input);
                const { id } = await (0, checkAuth_utils_1.default)(context);
                await _drizzle_1.db.delete(schema_1.moduleFaqs).where((0, drizzle_orm_1.eq)(schema_1.moduleFaqs.id, id));
                return {
                    id: input.id,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async sortFaq(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                console.log(input);
                if (input.length === 0) {
                    return;
                }
                const sqlChunks = [];
                const ids = [];
                sqlChunks.push((0, drizzle_orm_1.sql) `(case`);
                for (const data of input) {
                    sqlChunks.push((0, drizzle_orm_1.sql) `when ${schema_1.moduleFaqs.id} = ${data.id} then ${Number(data.sort)}`);
                    ids.push(data.id);
                }
                sqlChunks.push((0, drizzle_orm_1.sql) `end)`);
                const finalSql = drizzle_orm_1.sql.join(sqlChunks, drizzle_orm_1.sql.raw(' '));
                console.log(sqlChunks);
                await _drizzle_1.db
                    .update(schema_1.moduleFaqs)
                    .set({ sort: finalSql })
                    .where((0, drizzle_orm_1.inArray)(schema_1.moduleFaqs.id, ids));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.faqResolvers = faqResolvers;
