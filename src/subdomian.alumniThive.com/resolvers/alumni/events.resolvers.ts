import { and, eq } from "drizzle-orm";
import { db } from "../../../../@drizzle";
import domainCheck from "../../../commanUtils/domianCheck";
import {
  eventCreateSponsorShip,
  eventForGroupInput,
} from "../../ts-types/event.ts-types";
import checkAuth from "../../utils/auth/checkAuth.utils";
import {
  eventHost,
  events,
  eventsOrganizer,
  eventsPayments,
  eventsSponsorShip,
  groups,
} from "../../../../@drizzle/src/db/schema";
import { GraphQLError } from "graphql";
import slugify from "slugify";
import upload from "../../utils/upload/upload.utils";
import { groupSlug } from "../../ts-types/group.ts-type";

const eventsResolvers = {
  Query: {
    async getAllEvents(_: any, { input }: any, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const find = await db.query.events.findMany({
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
        console.log(find);

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

    async getEventBySlug(_: any, { input }: groupSlug, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const eventDetails = await db.query.events.findFirst({
          where: and(eq(events.slug, input.slug)),
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
        return {
          ...eventDetails,
          eventCreator: {
            ...eventDetails?.eventCreator?.alumni,
            aboutAlumni: eventDetails?.eventCreator?.alumni?.aboutAlumni,
          },
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getEventAsHost(_: any, { input }: groupSlug, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);
        console.log(id, org_id);

        const eventDetails = await db.query.eventHost.findMany({
          where: and(eq(eventHost.alumniId, id)),
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          with: {
            event: true,
            alumni: {
              with: {
                alumni: true,
              },
            },
          },
        });

        // const eventDetails = await db.query.events.findFirst({
        //   where: and(eq(events.slug, input.slug)),
        //   orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        //   with: {
        //     eventsPayments: true,
        //     eventCreator: {
        //       with: {
        //         alumni: {
        //           with: {
        //             aboutAlumni: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // });

        return eventDetails.map((set) => ({
          ...set?.event,
          eventHost: {
            role: set?.hostType,
          },
        }));
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getEventSponsorship(_: any, { input }: groupSlug, context: any) {
      try {
        const { id } = await checkAuth(context);

        const org_id = await domainCheck(context);

        const eventDetails = await db.query.events.findFirst({
          where: and(eq(events.slug, input.slug)),
        });

        const eventSponsorship = await db.query.eventsSponsorShip.findMany({
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          where: and(eq(eventsSponsorShip.eventId, eventDetails.id)),
          with: {
            event: true,
          },
        });

        return eventSponsorship;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    async createEventForGroup(
      _: any,
      { input }: eventForGroupInput,
      context: any
    ) {
      try {
        let cover;
        // await db.delete(eventsPayments);
        const { id } = await checkAuth(context);
        const org_id = await domainCheck(context);

        if (input?.cover) {
          cover = await upload(input.cover);
        }

        const find = await db.query.groups.findFirst({
          where: and(eq(groups.id, input.group)),
        });

        if (!find) {
          return new GraphQLError("No Group found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
        let slug = slugify(input.name, {
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: false,
          locale: "vi",
          trim: true,
        });
        const findEvent = await db.query.events.findMany({
          where: (events, { eq }) => eq(events.slug, slug),
        });

        if (findEvent) {
          var val = Math.floor(1000 + Math.random() * 9000);
          slug = slug + "-" + val;
        }

        const createEvents = await db
          .insert(events)
          .values({
            cover: cover ? cover : "defaultEventCover.png",
            eventCreator: id,
            name: input.name,
            slug,
            eventType: input.eventType,
            organization: org_id,
            venue: input.venue,
            registrationEndDate: input.registrationEndDate,
            eventStartTime: input.eventStartTime,
            eventEndTime: input.eventEndTime,
            eventVisibility: input.eventVisibility,
            group: input.group,
            details: input.details,
          })
          .returning();

        await db.insert(eventsPayments).values({
          eventCost: input.eventCost,
          accountNumber: input.accountNumber,
          bankName: input.bankName,
          ifscCode: input.ifscCode,
          paymentMode: input.paymentMode,
          currency: input.currency,
          costPerAdults: input.costPerAdults,
          costPerChildren: input.costPerChildren,
          eventId: createEvents[0].id,
        });

        await db.insert(eventsOrganizer).values({
          contactEmail: input.contactEmail,
          contactNumber: input.contactNumber,
          eventId: createEvents[0].id,
        });

        const eventDetails = await db.query.events.findFirst({
          where: and(eq(events.id, createEvents[0].id)),
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
        return {
          ...eventDetails,
          eventCreator: {
            ...eventDetails?.eventCreator?.alumni,
            aboutAlumni: eventDetails?.eventCreator?.alumni?.aboutAlumni,
          },
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async createEvent(_: any, { input }: eventForGroupInput, context: any) {
      try {
        let cover;
        // await db.delete(eventsPayments);
        const { id } = await checkAuth(context);
        const org_id = await domainCheck(context);

        if (input?.cover) {
          cover = await upload(input.cover);
        }

        let slug = slugify(input.name, {
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: false,
          locale: "vi",
          trim: true,
        });
        const findEvent = await db.query.events.findMany({
          where: (events, { eq }) => eq(events.slug, slug),
        });

        if (findEvent) {
          var val = Math.floor(1000 + Math.random() * 9000);
          slug = slug + "-" + val;
        }

        const createEvents = await db
          .insert(events)
          .values({
            cover: cover ? cover : "defaultEventCover.png",
            eventCreator: id,
            name: input.name,
            slug,
            eventType: input.eventType,
            organization: org_id,
            venue: input.venue,
            registrationEndDate: input.registrationEndDate,
            eventStartTime: input.eventStartTime,
            eventEndTime: input.eventEndTime,
            eventVisibility: input.eventVisibility,
            details: input.details,
          })
          .returning();

        await db.insert(eventsPayments).values({
          eventCost: input.eventCost,
          accountNumber: input.accountNumber,
          bankName: input.bankName,
          ifscCode: input.ifscCode,
          paymentMode: input.paymentMode,
          currency: input.currency,
          costPerAdults: input.costPerAdults,
          costPerChildren: input.costPerChildren,
          eventId: createEvents[0].id,
        });

        await db.insert(eventsOrganizer).values({
          contactEmail: input.contactEmail,
          contactNumber: input.contactNumber,
          eventId: createEvents[0].id,
        });

        await db.insert(eventHost).values({
          alumniId: id,
          hostType: "organizer",
          eventId: createEvents[0].id,
        });

        const eventDetails = await db.query.events.findFirst({
          where: and(eq(events.id, createEvents[0].id)),
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
        return {
          ...eventDetails,
          eventCreator: {
            ...eventDetails?.eventCreator?.alumni,
            aboutAlumni: eventDetails?.eventCreator?.alumni?.aboutAlumni,
          },
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async addSponsorShip(
      _: any,
      { input }: eventCreateSponsorShip,
      context: any
    ) {
      try {
        const eventDetails = await db.query.events.findFirst({
          where: and(eq(events.slug, input.slug)),
        });
        if (!eventDetails) {
          return new GraphQLError("No Event found", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }

        const sponsor = await db
          .insert(eventsSponsorShip)
          .values({
            eventId: eventDetails.id,
            sponsorType: input.type,
            price: input.price,
            currency: input.currency,
            content: input.content,
          })
          .returning();

        return sponsor[0];
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async deleteSponsorShip(
      _: any,
      { input }: eventCreateSponsorShip,
      context: any
    ) {
      try {
        await checkAuth(context);
        await domainCheck(context);
        const deleteSponsorShip = await db
          .delete(eventsSponsorShip)
          .where(eq(eventsSponsorShip.id, input.id))
          .returning();

        return deleteSponsorShip[0];
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export { eventsResolvers };
