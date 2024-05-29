import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../../../../@drizzle";
import {
  alumniToOrganization,
  groupInvitation,
  groupRequest,
  groups,
  groupsSetting,
  groupMember,
  alumniFeed,
  feedReactions,
  aboutAlumni,
  events,
  media,
} from "../../../../@drizzle/src/db/schema";
import {
  acceptInvitation,
  acceptInvitationInput,
  acceptRequestGroup,
  addGroupInput,
  feedLike,
  groupFeed,
  groupSlug,
  invitationInput,
} from "../../ts-types/group.ts-type";
import checkAuth from "../../utils/auth/checkAuth.utils";
import slugify from "slugify";
import { GraphQLError } from "graphql";
import domainCheck from "../../../commanUtils/domianCheck";
import uploadFeedImage from "../../../tenant/admin/utils/upload/uploadFeedImage.utils";

const groupResolvers = {
  Query: {
    async getYourGroup(_: any, { input }: addGroupInput, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const set = await db
          .update(alumniToOrganization)
          .set({ isApproved: true })
          .where(eq(alumniToOrganization.alumniId, id))
          .returning();

        const find = await db.query.groups.findMany({
          where: eq(groups.organization, org_id),
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          with: {
            groupMember: {
              with: {
                alumni: {
                  with: {
                    alumni: true,
                  },
                },
              },
            },
          },
        });
        console.log(find);

        return find.map((set) => ({
          ...set,
          admin: set?.groupMember?.filter((set) => set?.role === "admin")[0]
            ?.alumni?.alumni,
          total: set?.groupMember?.length,
        }));
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getGroupBySlug(_: any, { input }: groupSlug, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const { slug } = await input;

        const find = await db.query.groups.findFirst({
          where: (d, { eq }) => eq(d.slug, slug),
          with: {
            setting: true,
            groupRequest: true,
            groupMember: {
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
          },
        });

        if (find) {
          const isJoinRequest = await find?.groupRequest.some(
            (e) => e?.alumniId === id
          );
          const isGroupMember = await find?.groupMember.some(
            (e) => e?.alumniId === id
          );

          const isGroupAdmin = await find?.groupMember.some(
            (e) => e?.alumniId === id && e.role === "admin"
          );

          console.log(isGroupAdmin);

          return {
            ...find,
            privacy: find?.setting?.privacy,
            isGroupMember,
            isGroupAdmin,
            isJoinRequest,
            groupMember: find?.groupMember?.map((t) => ({
              id: t?.alumniId,
              role: t?.role,

              user: {
                ...t?.alumni?.alumni,
                aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
              },
            })),
          };
        } else {
          throw new GraphQLError("No Group found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getGroupBySlugPeople(_: any, { input }: groupSlug, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const { slug } = input;

        console.log(input);
        const find = await db.query.groups.findFirst({
          where: (d, { eq }) => eq(d.slug, slug),
          with: {
            setting: true,
            groupMember: {
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
          },
        });

        const data = await find.groupMember.map((set) => ({
          ...set?.alumni?.alumni,
          role: set.role,
          memberSince: set.createdAt,
        }));

        console.log(data);

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getAllGroupPeople(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const find = await db.query.groupMember.findMany({
          where: and(eq(groupMember.groupId, input.id)),
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
        });
        return find.map((t) => ({
          id: t?.alumniId,
          role: t?.role,
          user: {
            ...t?.alumni?.alumni,
            aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
          },
        }));
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getAllGroupRequest(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);
        const find = await db.query.groupRequest.findMany({
          where: and(
            eq(groupRequest.groupId, input.id),
            eq(groupRequest.isAccepted, false)
          ),
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
        });
        return find.map((t) => ({
          id: t.alumniId,
          createdAt: t.createdAt,

          user: {
            ...t?.alumni?.alumni,
            aboutAlumni: t?.alumni?.alumni?.aboutAlumni,
          },
        }));
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getAllGroupEvents(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);
        console.log(input);

        const find = await db.query.events.findMany({
          where: and(eq(events.group, input.id)),
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          with: {
            eventsPayments: true,
            eventCreator: {
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

        return find.map((t) => ({
          ...t,
          eventCreator: {
            ...t?.eventCreator?.alumni,
            aboutAlumni: t?.eventCreator?.alumni?.aboutAlumni,
          },
        }));
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    async createGroup(_: any, { input }: addGroupInput, context: any) {
      try {
        const { id } = await checkAuth(context);
        const org_id = await domainCheck(context);

        const { name, privacy, about, groupType } = input;

        let slug = slugify(name, {
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: false,
          locale: "vi",
          trim: true,
        });
        const find = await db.query.groups.findMany({
          where: (group, { eq }) => eq(group.slug, slug),
        });

        if (find) {
          var val = Math.floor(1000 + Math.random() * 9000);
          slug = slug + "-" + val;
        }

        const createGroup = await db
          .insert(groups)
          .values({
            slug,
            name,
            creator: id,
            organization: org_id,
            about,
          })
          .returning({ id: groups.id });

        await db.insert(groupsSetting).values({
          joiningConditions: "Admin only Add",
          privacy: privacy,
          groupId: createGroup[0].id,
          groupType: groupType,
        });

        await db.insert(groupMember).values({
          alumniId: id,
          groupId: createGroup[0].id,
          role: "admin",
        });

        return createGroup;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async inviteMember(_: any, { input }: invitationInput, context: any) {
      try {
        const find = await db.query.groups.findFirst({
          where: eq(groups.slug, input.group),
        });

        if (!find) {
          throw new GraphQLError("No Group found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
        const request = input.id.map((t) => ({
          alumniId: t,
          groupId: find.id,
          isAccepted: false,
        }));

        const createInvitation = await db
          .insert(groupInvitation)
          .values(request);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async acceptInvitation(
      _: any,
      { input }: acceptInvitationInput,
      context: any
    ) {
      try {
        const { id } = await checkAuth(context);
        const find = await db.query.groups.findFirst({
          where: eq(groups.slug, input.group),
        });

        if (!find) {
          throw new GraphQLError("No Group found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }

        const checkInvitationFound = await db.query.groupInvitation.findFirst({
          where: and(
            eq(groupInvitation.groupId, find.id),
            eq(groupInvitation.alumniId, id)
          ),
        });

        if (!checkInvitationFound) {
          throw new GraphQLError("No Invitation found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }

        if (checkInvitationFound.isAccepted === true) {
          throw new GraphQLError("Invitation Already Accepted", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }

        await db
          .update(groupInvitation)
          .set({ isAccepted: true })
          .where(eq(groupInvitation.groupId, checkInvitationFound.groupId));

        const addUserToGroup = await db
          .insert(groupMember)
          .values({
            alumniId: id,
            groupId: find.id,
          })
          .returning();
        return addUserToGroup;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async leaveGroup(_: any, { input }: acceptInvitationInput, context: any) {
      try {
        const { id } = await checkAuth(context);
        const find = await db.query.groups.findFirst({
          where: eq(groups.slug, input.group),
        });

        if (!find) {
          throw new GraphQLError("No Group found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
        const checkUser = await db.query.groupMember.findFirst({
          where: and(
            eq(groupMember.groupId, find.id),
            eq(groupMember.alumniId, id)
          ),
        });

        if (!checkUser) {
          throw new GraphQLError("You already leaved the group", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
        console.log(checkUser);
        const leave = await db
          .delete(groupMember)
          .where(eq(groupMember.alumniId, id));
        const removeInvitation = await db
          .delete(groupInvitation)
          .where(eq(groupInvitation.alumniId, id));
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async joinGroup(_: any, { input }: acceptInvitationInput, context: any) {
      try {
        const { id } = await checkAuth(context);
        const find = await db.query.groups.findFirst({
          where: eq(groups.id, input.group),
          with: {
            groupMember: true,
            setting: true,
          },
        });
        console.log(find);

        if (!find) {
          throw new GraphQLError("No Group found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
        const checkIfExist = await db.query.groupMember.findFirst({
          where: and(
            eq(groupMember.groupId, find.id),
            eq(groupMember.alumniId, id)
          ),
        });
        const checkIfRequested = await db.query.groupRequest.findFirst({
          where: and(
            eq(groupMember.groupId, find.id),
            eq(groupMember.alumniId, id)
          ),
        });

        if (checkIfExist) {
          return new GraphQLError("You are AllReady in Group", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
        if (checkIfRequested) {
          return new GraphQLError("You are haved All Ready requested", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
        if (find?.setting?.privacy === "private") {
          await db
            .insert(groupRequest)
            .values({
              alumniId: id,
              groupId: find.id,
            })
            .returning();

          return {
            succuss: true,
          };
        }
        if (find?.setting?.privacy === "public") {
          if (find?.setting?.joiningConditions === "Admin only Add") {
            const request = await db.query.groupRequest.findFirst({
              where: and(
                eq(groupRequest.groupId, find.id),
                eq(groupRequest.alumniId, id)
              ),
            });
            if (request) {
              return new GraphQLError("Request AlReady sent", {
                extensions: {
                  code: 400,
                  http: { status: 400 },
                },
              });
            }

            const sentRequest = await db
              .insert(groupRequest)
              .values({
                alumniId: id,
                groupId: find.id,
              })
              .returning();
            console.log(sentRequest);
          }

          if (find?.setting?.joiningConditions === "Anyone Can Join") {
            const checkIfExist = await db.query.groupMember.findFirst({
              where: and(
                eq(groupMember.groupId, find.id),
                eq(groupMember.alumniId, id)
              ),
            });
            if (checkIfExist) {
              return new GraphQLError("You are AllReady in Group", {
                extensions: {
                  code: 400,
                  http: { status: 400 },
                },
              });
            }
            const addUser = await db
              .insert(groupMember)
              .values({
                alumniId: id,
                groupId: find.id,
              })
              .returning();
            console.log(addUser, "sdsd");
          }
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async likeFeed(_: any, { input }: feedLike, context: any) {
      try {
        const { id } = await checkAuth(context);
        const org_id = await domainCheck(context);
        const find = await db.query.feedReactions.findFirst({
          where: and(
            eq(feedReactions.alumniId, id),
            eq(feedReactions.feedId, input.id)
          ),
        });

        if (!find) {
          const data = await db
            .insert(feedReactions)
            .values({
              alumniId: id,
              feedId: input.id,
              reactionsType: input.type,
            })
            .returning();
          const set = await db.query.feedReactions.findFirst({
            where: and(
              eq(feedReactions.feedId, data[0].feedId),
              eq(feedReactions.alumniId, data[0].alumniId)
            ),
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
          });
          return {
            feedId: set.feedId,
            type: set.reactionsType,
            user: {
              ...set.alumni?.alumni,
              aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
            },
          };
        }
        if (find) {
          const data = await db
            .update(feedReactions)
            .set({ reactionsType: input.type })
            .where(
              and(
                eq(feedReactions.alumniId, id),
                eq(feedReactions.feedId, input.id)
              )
            )
            .returning();
          const set = await db.query.feedReactions.findFirst({
            where: and(
              eq(feedReactions.feedId, data[0].feedId),
              eq(feedReactions.alumniId, data[0].alumniId)
            ),
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
          });
          return {
            feedId: set.feedId,
            type: set.reactionsType,
            user: {
              ...set.alumni?.alumni,
              aboutAlumni: set?.alumni?.alumni?.aboutAlumni,
            },
          };
        }

        // console.log(input.id, input.type);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async acceptRequestGroup(
      _: any,
      { input }: acceptRequestGroup,
      context: any
    ) {
      try {
        const { id } = await checkAuth(context);
        const checkIfUserExists = await db.query.groupMember.findFirst({
          where: and(
            eq(groupMember.groupId, input.groupID),
            eq(groupMember.alumniId, input.alumniId)
          ),
        });
        if (checkIfUserExists)
          return {
            id: checkIfUserExists.alumniId,
          };

        const checkIfRequestedValid = await db.query.groupRequest.findFirst({
          where: and(
            eq(groupMember.groupId, input.groupID),
            eq(groupMember.alumniId, input.alumniId)
          ),
        });
        if (checkIfRequestedValid) {
          if (input.accept) {
            await db
              .update(groupRequest)
              .set({ isAccepted: true })
              .where(
                and(
                  eq(groupRequest.groupId, input.groupID),
                  eq(groupRequest.alumniId, input.alumniId)
                )
              )
              .returning();
            await db
              .insert(groupMember)
              .values({
                alumniId: input.alumniId,
                groupId: input.groupID,
              })
              .returning();

            return {
              id: input.alumniId,
            };
          } else {
            await db
              .delete(groupRequest)
              .where(
                and(
                  eq(groupRequest.groupId, input.groupID),
                  eq(groupRequest.alumniId, input.alumniId)
                )
              );
            return {
              id: input.alumniId,
            };
          }
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export { groupResolvers };
