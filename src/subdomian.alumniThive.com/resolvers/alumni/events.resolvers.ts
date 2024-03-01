import { and, eq } from "drizzle-orm";
import { db } from "../../../../@drizzle";
import domainCheck from "../../../commanUtils/domianCheck";
import { eventForGroupInput } from "../../ts-types/event.ts-types";
import checkAuth from "../../utils/auth/checkAuth.utils";
import {
  events,
  eventsPayments,
  groups,
} from "../../../../@drizzle/src/db/schema";
import { GraphQLError } from "graphql";
import slugify from "slugify";
import upload from "../../utils/upload/upload.utils";

const eventsResolvers = {
  Query: {},
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
            eventHost: id,
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

        const eventDetails = await db.query.events.findFirst({
          where: and(eq(events.id, createEvents[0].id)),
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          with: {
            eventsPayments: true,
            eventHost: {
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
          eventHost: {
            ...eventDetails?.eventHost?.alumni,
            aboutAlumni: eventDetails?.eventHost?.alumni?.aboutAlumni,
          },
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export { eventsResolvers };
