import { and, desc, eq } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import {
    mentorShip,
    mentorshipCategory,
    mentorshipSkills,
} from '../../../../@drizzle/src/db/schema'
import checkAuth from '../../utils/auth/checkAuth.utils'
import { GraphQLError } from 'graphql'

export const userOrg = async (id) => {
    const findUser = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, id),
        with: {
            organization: {
                with: {},
            },
        },
    })
    return findUser.organization.id
}

const mentorShipResolvers = {
    Query: {
        async getAllMentorCategory(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const set = await db.query.mentorshipCategory.findMany({
                    where: (mentorshipCategory, { eq }) =>
                        eq(mentorshipCategory.organization, userOrgId),
                    orderBy: (mentorshipCategory, { desc }) => [
                        desc(mentorshipCategory.createdAt),
                    ],
                })

                return set
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getAllMentorSkills(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const set = await db.query.mentorshipSkills.findMany({
                    where: (mentorshipCategory, { eq }) =>
                        eq(mentorshipCategory.organization, userOrgId),
                    orderBy: (mentorshipCategory, { desc }) => [
                        desc(mentorshipCategory.createdAt),
                    ],
                })

                return set
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllMentor(_: any, { input }: any, context: any) {
            try {
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)
                const set = await db.query.mentorShip.findMany({
                    where: (mentorShip, { eq }) =>
                        eq(mentorShip.organization, userOrgId),
                    orderBy: (mentorShip, { desc }) => [
                        desc(mentorShip.createdAt),
                    ],
                    with: {
                        category: true,
                        user: {
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        },
                    },
                })

                console.log(JSON.stringify(set, null, 4))
                return set
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        // async getAllApprovedMentor(_: any, { input }: any, context: any) {
        //   try {
        //     const data = await checkAuth(context);

        //     const userOrgId = await userOrg(data.id);
        //     const set = await db.query.mentorShip.findMany({
        //       where: (mentorShip, { eq }) => eq(mentorShip.organization, userOrgId),
        //       orderBy: (mentorShip, { desc }) => [desc(mentorShip.createdAt)],
        //     });

        //     return set;
        //   } catch (error) {
        //     console.log(error);
        //     throw error;
        //   }
        // },
        // async getAllMentorRequests(_: any, { input }: any, context: any) {
        //   try {
        //     const data = await checkAuth(context);

        //     const userOrgId = await userOrg(data.id);
        //     const set = await db.query.mentorShip.findMany({
        //       where: (mentorShip, { eq }) => eq(mentorShip.organization, userOrgId),
        //       orderBy: (mentorShip, { desc }) => [desc(mentorShip.createdAt)],
        //     });

        //     return set;
        //   } catch (error) {
        //     console.log(error);
        //     throw error;
        //   }
        // },
        // async getAllBlockedMentor(_: any, { input }: any, context: any) {
        //   try {
        //     const data = await checkAuth(context);

        //     const userOrgId = await userOrg(data.id);
        //     const set = await db.query.mentorShip.findMany({
        //       where: (mentorShip, { eq }) => eq(mentorShip.organization, userOrgId),
        //       orderBy: (mentorShip, { desc }) => [desc(mentorShip.createdAt)],
        //     });

        //     return set;
        //   } catch (error) {
        //     console.log(error);
        //     throw error;
        //   }
        // },
    },
    Mutation: {
        async mentorShipActions(_: any, { input }: any, context: any) {
            try {
                const check = await db.query.mentorShip.findFirst({
                    where: (mentorShip, { eq }) =>
                        and(eq(mentorShip.id, input.mentorshipID)),
                })
                console.log(check)

                const update = await db
                    .update(mentorShip)
                    .set({ isApproved: true })
                    .where(eq(mentorShip.id, input.mentorshipID))
                    .returning()

                console.log(update)
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async addMentorShipCategory(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const set = await db.query.mentorshipCategory.findFirst({
                    where: (mentorshipCategory, { eq }) =>
                        and(
                            eq(mentorshipCategory.organization, userOrgId),
                            eq(mentorshipCategory.title, input.title)
                        ),
                })

                console.log(set)

                if (set) {
                    return new GraphQLError('Category AllReady exist', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    })
                }
                const createOrganization = await db
                    .insert(mentorshipCategory)
                    .values({
                        title: input.title,
                        organization: userOrgId,
                    })
                    .returning()
                return createOrganization
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteMentorShipCategory(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)
                await userOrg(data.id)
                const category = await db
                    .delete(mentorshipCategory)
                    .where(eq(mentorshipCategory.id, input.id))
                    .returning()
                return category
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateMentorShipCategory(
            _: any,
            { input }: any,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)

                const category = await db.query.mentorshipCategory.findFirst({
                    where: and(eq(mentorshipCategory.id, input.id)),
                })

                console.log(input)

                const createFeedBack = await db
                    .insert(mentorshipCategory)
                    .values({
                        organization: category.organization,
                        title: `${category.title}-copy-1`,
                    })
                    .returning()
                return createFeedBack
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addMentorShipSkills(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)

                const userOrgId = await userOrg(data.id)

                const set = await db.query.mentorshipSkills.findFirst({
                    where: (mentorShipSkills, { eq }) =>
                        and(
                            eq(mentorShipSkills.organization, userOrgId),
                            eq(mentorShipSkills.title, input.title)
                        ),
                })

                console.log(set)

                if (set) {
                    return new GraphQLError('Skill AllReady exist', {
                        extensions: {
                            code: 'NOT FOUND',
                            http: { status: 400 },
                        },
                    })
                }
                const createOrganization = await db
                    .insert(mentorshipSkills)
                    .values({
                        title: input.title,
                        organization: userOrgId,
                    })
                    .returning()
                return createOrganization
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteMentorShipSkills(_: any, { input }: any, context: any) {
            try {
                console.log(input)
                const data = await checkAuth(context)
                await userOrg(data.id)
                const category = await db
                    .delete(mentorshipSkills)
                    .where(eq(mentorshipSkills.id, input.id))
                    .returning()
                return category
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async duplicateMentorShipSkills(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const category = await db.query.mentorshipSkills.findFirst({
                    where: and(eq(mentorshipSkills.id, input.id)),
                })

                console.log(input)

                const createFeedBack = await db
                    .insert(mentorshipSkills)
                    .values({
                        organization: category.organization,
                        title: `${category.title}-copy-1`,
                    })
                    .returning()
                return createFeedBack
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { mentorShipResolvers }
