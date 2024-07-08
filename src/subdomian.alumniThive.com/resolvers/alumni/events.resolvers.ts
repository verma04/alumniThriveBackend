import { and, eq, ilike, not, or, sql } from 'drizzle-orm'
import { db } from '../../../../@drizzle'
import domainCheck from '../../../commanUtils/domianCheck'
import {
    addAgenda,
    addAgendaProps,
    addMediaProps,
    addSpeakerProps,
    addSponsorProps,
    addVenueProps,
    eventCreateSponsorShip,
    eventForGroupInput,
} from '../../ts-types/event.ts-types'
import checkAuth from '../../utils/auth/checkAuth.utils'
import {
    alumniToOrganization,
    eventCostTypeEnum,
    eventHost,
    events,
    eventsAgenda,
    eventsAttendees,
    eventsMedia,
    eventsOrganizer,
    eventsPayments,
    eventSponsors,
    eventsSpeakers,
    eventsSponsorShip,
    eventsVenue,
    eventTypesEnum,
    groups,
    organization,
} from '../../../../@drizzle/src/db/schema'
import { GraphQLError } from 'graphql'
import slugify from 'slugify'
import upload from '../../utils/upload/upload.utils'
import { group, groupSlug } from '../../ts-types/group.ts-type'
import uploadImageToFolder from '../../../tenant/admin/utils/upload/uploadImageToFolder.utils'
const Razorpay = require('razorpay')
const stripe = require('stripe')

const eventCondition = ({ mode, cost, org_id, search }) => {
    const conditions = and(
        eq(events.organization, org_id),
        eq(events.isApproved, false),
        and(
            !search || search?.length === 0
                ? not(ilike(events.name, `%${null}%`))
                : or(
                      ilike(events.name, `%${search}%`),
                      ilike(events.details, `%${search}%`)
                  ),
            mode ? eq(events.eventType, mode) : eq(events.organization, org_id),
            cost
                ? eq(eventsPayments.eventCost, cost)
                : eq(events.organization, org_id)
        )
    )
    return conditions
}

const eventsResolvers = {
    Query: {
        async getEventsType(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                return eventTypesEnum?.enumValues
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getEventCostType(_: any, {}: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                return eventCostTypeEnum?.enumValues
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllEvents(_: any, { input }: any, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                console.log(input)

                const { cost, search, offset, limit, mode } = input

                const conditions = eventCondition({
                    mode,
                    cost,
                    org_id,
                    search,
                })

                const totalRecords = await db
                    .select({ count: sql`count(*)`.mapWith(Number) })
                    .from(events)
                    .leftJoin(
                        eventsPayments,
                        eq(events.id, eventsPayments.eventId)
                    )

                    .where(conditions)

                const paginatedData = await db
                    .select({
                        events: events,
                        eventsPayments: eventsPayments,
                    })
                    .from(events)
                    .leftJoin(
                        eventsPayments,
                        eq(events.id, eventsPayments.eventId)
                    )
                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(limit)

                console.log(paginatedData, search)
                return {
                    totalRecords: totalRecords[0].count,
                    data: paginatedData.map((set) => ({
                        ...set?.events,
                        eventsPayments: set.eventsPayments,
                    })),
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getEventBySlug(_: any, { input }: groupSlug, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

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
                })

                const ifExist = await db.query.eventsAttendees.findFirst({
                    where: and(
                        eq(eventsAttendees.eventId, eventDetails.id),
                        eq(eventsAttendees.alumni, id)
                    ),
                })

                return {
                    ...eventDetails,
                    eventCreator: {
                        ...eventDetails?.eventCreator?.alumni,
                        aboutAlumni:
                            eventDetails?.eventCreator?.alumni?.aboutAlumni,
                    },
                    isRegistered: ifExist ? true : false,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getEventAsHost(_: any, { input }: groupSlug, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)
                console.log(id, org_id)

                const eventDetails = await db.query.eventHost.findMany({
                    where: and(
                        eq(eventHost.alumniId, id),
                        eq(eventHost.organization, org_id)
                    ),
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    with: {
                        event: true,
                        alumni: {
                            with: {
                                alumni: true,
                            },
                        },
                    },
                })

                return eventDetails.map((set) => ({
                    ...set?.event,
                    eventHost: {
                        role: set?.hostType,
                    },
                }))
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getEventSponsorship(_: any, { input }: groupSlug, context: any) {
            try {
                const { id } = await checkAuth(context)

                const org_id = await domainCheck(context)

                const eventDetails = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })

                const eventSponsorship =
                    await db.query.eventsSponsorShip.findMany({
                        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                        where: and(
                            eq(eventsSponsorShip.eventId, eventDetails.id)
                        ),
                        with: {
                            event: true,
                        },
                    })

                return eventSponsorship
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getAllHost(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)
                await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })
                const host = await db.query.eventHost.findMany({
                    where: and(eq(eventHost.eventId, event.id)),
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
                })
                return host.map((t) => ({
                    id: t.alumniId,
                    hostType: t.hostType,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                    alumni: t?.alumni?.alumni,
                }))
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllVenue(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)
                await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })
                const venue = await db.query.eventsVenue.findMany({
                    where: and(eq(eventsVenue.eventId, event.id)),
                })

                return venue
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getAllSpeakers(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)
                await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })
                const speakers = await db.query.eventsSpeakers.findMany({
                    where: and(eq(eventsVenue.eventId, event.id)),
                })

                return speakers
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getAllAgenda(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)
                await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })
                const speakers = await db.query.eventsAgenda.findMany({
                    where: and(eq(eventsAgenda.eventId, event.id)),
                })

                return speakers
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        async getEventGallery(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)
                await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })
                const speakers = await db.query.eventsMedia.findMany({
                    where: and(eq(eventsMedia.eventId, event.id)),
                })

                return speakers
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getEventSponsors(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)
                await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })
                console.log(event)
                const sponsors = await db.query.eventSponsors.findMany({
                    where: and(eq(eventSponsors.eventId, event.id)),
                    with: {
                        sponsorShip: true,
                    },
                })

                return sponsors
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getSponsorshipEvents(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)

                await domainCheck(context)

                const eventDetails = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })

                const eventSponsorship =
                    await db.query.eventsSponsorShip.findMany({
                        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                        where: and(
                            eq(eventsSponsorShip.eventId, eventDetails.id)
                        ),
                    })

                const eventSponsor = await db.query.eventSponsors.findMany({
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    where: and(eq(eventSponsors.eventId, eventDetails.id)),
                    with: {
                        sponsorShip: true,
                    },
                })

                return {
                    eventSponsorship: eventSponsorship,
                    eventSponsors: eventSponsor,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getSpeakersEvents(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)

                await domainCheck(context)
                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })
                const speakers = await db.query.eventsSpeakers.findMany({
                    where: and(eq(eventsVenue.eventId, event.id)),
                })

                return speakers
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async getPaidEventsDetails(_: any, { input }: groupSlug, context: any) {
            try {
                await checkAuth(context)

                const org = await domainCheck(context)

                console.log(input, org)

                // const paymentDetails = await db.query.razorpay.findFirst({
                //   where: and(eq(razorpay.organization, org)),
                // });

                // console.log(paymentDetails, "dssd");

                const razorpayDetials = await db.query.organization.findFirst({
                    where: eq(organization.id, org),
                    with: {
                        razorpay: true,
                    },
                })
                console.log(razorpayDetials)
                // const event = await db.query.events.findFirst({
                //   where: and(eq(events.slug, input.slug)),
                //   with: {
                //     eventsPayments: true,
                //   },
                // });
                // console.log(paymentDetails, event.eventsPayments);

                const razorpay = new Razorpay({
                    key_id: razorpayDetials?.razorpay?.keyID,
                    key_secret: razorpayDetials?.razorpay?.keySecret,
                })
                const options = {
                    amount: 4000,
                    currency: 'INR',
                    receipt: 'any unique id for every order',
                    payment_capture: 1,
                }
                const response = await razorpay.orders.create(options)

                return {
                    orderId: response.id,
                    currency: response.currency,
                    amount: response.amount,
                }
            } catch (error) {
                console.log(error)
                throw error
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
                let cover
                // await db.delete(eventsPayments);
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)

                if (input?.cover) {
                    cover = await upload(input.cover)
                }

                const find = await db.query.groups.findFirst({
                    where: and(eq(groups.id, input.group)),
                })

                if (!find) {
                    return new GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                let slug = slugify(input.name, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                })
                const findEvent = await db.query.events.findFirst({
                    where: (events, { eq }) => eq(events.slug, slug),
                })

                if (findEvent) {
                    const val = Math.floor(1000 + Math.random() * 9000)
                    slug = slug + '-' + val
                }

                const createEvents = await db
                    .insert(events)
                    .values({
                        cover: cover ? cover : 'defaultEventCover.png',
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
                    .returning()

                await db.insert(eventsPayments).values({
                    eventCost: input.eventCost,

                    costPerAdults: input.costPerAdults,
                    costPerChildren: input.costPerChildren,
                    eventId: createEvents[0].id,
                })

                await db.insert(eventsOrganizer).values({
                    contactEmail: input.contactEmail,
                    contactNumber: input.contactNumber,
                    eventId: createEvents[0].id,
                })

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
                })
                return {
                    ...eventDetails,
                    eventCreator: {
                        ...eventDetails?.eventCreator?.alumni,
                        aboutAlumni:
                            eventDetails?.eventCreator?.alumni?.aboutAlumni,
                    },
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async createEvent(_: any, { input }: eventForGroupInput, context: any) {
            try {
                let cover
                // await db.delete(eventsPayments);
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)

                if (input?.cover) {
                    cover = await upload(input.cover)
                }

                let slug = slugify(input.name, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                })
                const findEvent = await db.query.events.findMany({
                    where: (events, { eq }) => eq(events.slug, slug),
                })

                if (findEvent) {
                    const val = Math.floor(1000 + Math.random() * 9000)
                    slug = slug + '-' + val
                }

                const createEvents = await db
                    .insert(events)
                    .values({
                        cover: cover ? cover : 'defaultEventCover.png',
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
                    .returning()

                await db.insert(eventsPayments).values({
                    eventCost: input.eventCost,

                    costPerAdults: input.costPerAdults,
                    costPerChildren: input.costPerChildren,
                    eventId: createEvents[0].id,
                })

                await db.insert(eventsOrganizer).values({
                    contactEmail: input.contactEmail,
                    contactNumber: input.contactNumber,
                    eventId: createEvents[0].id,
                })

                await db.insert(eventHost).values({
                    alumniId: id,
                    hostType: 'host',
                    eventId: createEvents[0].id,
                    organization: org_id,
                })

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
                })
                return {
                    ...eventDetails,
                    eventCreator: {
                        ...eventDetails?.eventCreator?.alumni,
                        aboutAlumni:
                            eventDetails?.eventCreator?.alumni?.aboutAlumni,
                    },
                }
            } catch (error) {
                console.log(error)
                throw error
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
                })
                if (!eventDetails) {
                    return new GraphQLError('No Event found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                const sponsor = await db
                    .insert(eventsSponsorShip)
                    .values({
                        eventId: eventDetails.id,
                        sponsorType: input.type,
                        price: input.price,
                        currency: input.currency,
                        content: input.content,
                        showPrice: input.showPrice,
                    })
                    .returning()

                return sponsor[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async deleteSponsorShip(
            _: any,
            { input }: eventCreateSponsorShip,
            context: any
        ) {
            try {
                await checkAuth(context)
                await domainCheck(context)
                const deleteSponsorShip = await db
                    .delete(eventsSponsorShip)
                    .where(eq(eventsSponsorShip.id, input.id))
                    .returning()

                return deleteSponsorShip[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addHost(_: any, { input }: any, context: any) {
            try {
                await checkAuth(context)
                const org = await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.event)),
                })

                const checkHost = await db.query.eventHost.findFirst({
                    where: and(
                        eq(eventHost.alumniId, input.id),
                        eq(eventHost.eventId, event.id)
                    ),
                })
                if (checkHost) {
                    return new GraphQLError('Event Host AllReady Added', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                const createHost = await db
                    .insert(eventHost)
                    .values({
                        organization: org,
                        alumniId: input.id,
                        hostType: 'co-host',
                        eventId: event.id,
                    })
                    .returning()
                return createHost[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async removeHost(_: any, { input }: any, context: any) {
            try {
                await checkAuth(context)
                await domainCheck(context)

                console.log(input)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.event)),
                })

                const checkHost = await db.query.eventHost.findFirst({
                    where: and(
                        eq(eventHost.alumniId, input.id),
                        eq(eventHost.eventId, event.id)
                    ),
                })
                if (checkHost) {
                    const deleteHost = await await db
                        .delete(eventHost)
                        .where(
                            and(
                                eq(eventHost.alumniId, input.id),
                                eq(eventHost.eventId, event.id)
                            )
                        )
                        .returning()

                    return deleteHost
                }

                return new GraphQLError('No Event Found', {
                    extensions: {
                        code: 400,
                        http: { status: 400 },
                    },
                })
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addVenue(_: any, { input }: addVenueProps, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.event)),
                })
                if (!event) {
                    return new GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                const createVenue = await db
                    .insert(eventsVenue)
                    .values({
                        venue: input.venue,
                        address: input.address,
                        eventId: event.id,
                    })
                    .returning()
                return createVenue[0]
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addEventSpeaker(
            _: any,
            { input }: addSpeakerProps,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.event)),
                })
                if (!event) {
                    return new GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                console.log(input)
                if (input.type === 'internal') {
                    const speaker =
                        await db.query.alumniToOrganization.findFirst({
                            where: and(
                                eq(alumniToOrganization.alumniId, input.speaker)
                            ),
                            with: {
                                alumni: {
                                    with: {
                                        aboutAlumni: true,
                                    },
                                },
                            },
                        })
                    const createSpeaker = await db
                        .insert(eventsSpeakers)
                        .values({
                            fullName: `${speaker.alumni.firstName} ${speaker.alumni.lastName} `,
                            about: speaker.alumni.aboutAlumni.currentPosition,
                            avatar: speaker.alumni.avatar,
                            eventId: event.id,
                        })
                        .returning()
                    return createSpeaker[0]
                } else {
                    let cover
                    if (input?.cover) {
                        cover = await upload(input.cover)
                    }
                    const createSpeaker = await db
                        .insert(eventsSpeakers)
                        .values({
                            fullName: input.name,
                            about: input.about,
                            linkedin: input.linkedin,
                            avatar: cover ? cover : 'defaultEventCover.png',
                            eventId: event.id,
                        })
                        .returning()
                    return createSpeaker[0]
                }
                // const createVenue = await db
                //   .insert(eventsVenue)
                //   .values({
                //     venue: input.venue,
                //     address: input.address,
                //     eventId: event.id,
                //   })
                //   .returning();
                // return createVenue[0];
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addEventAgenda(_: any, { input }: addAgendaProps, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.event)),
                })
                if (!event) {
                    return new GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                const agenda = await db
                    .insert(eventsAgenda)
                    .values({
                        title: input.title,
                        eventId: event.id,
                        isPinned: input.isPinned,
                        startTime: '01:02',
                        date: input.date,
                        endTime: '13:02',
                        isPublished: true,
                        isDraft: false,
                    })
                    .returning()

                return agenda[0]

                // if (input.type === "internal") {
                //   const speaker = await db.query.alumniToOrganization.findFirst({
                //     where: and(eq(alumniToOrganization.alumniId, input.speaker)),
                //     with: {
                //       alumni: {
                //         with: {
                //           aboutAlumni: true,
                //         },
                //       },
                //     },
                //   });
                //   const createSpeaker = await db
                //     .insert(eventsSpeakers)
                //     .values({
                //       fullName: `${speaker.alumni.firstName} ${speaker.alumni.lastName} `,
                //       about: speaker.alumni.aboutAlumni.currentPosition,
                //       avatar: speaker.alumni.avatar,
                //       eventId: event.id,
                //     })
                //     .returning();

                //   return createSpeaker[0];
                // } else {
                //   let cover;
                //   if (input?.cover) {
                //     cover = await upload(input.cover);
                //   }
                //   const createSpeaker = await db
                //     .insert(eventsSpeakers)
                //     .values({
                //       fullName: input.name,
                //       about: input.about,
                //       linkedin: input.linkedin,
                //       avatar: cover ? cover : "defaultEventCover.png",
                //       eventId: event.id,
                //     })
                //     .returning();
                //   return createSpeaker[0];
                // }
                // const createVenue = await db
                //   .insert(eventsVenue)
                //   .values({
                //     venue: input.venue,
                //     address: input.address,
                //     eventId: event.id,
                //   })
                //   .returning();
                // return createVenue[0];
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addEventMedia(_: any, { input }: addMediaProps, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.event)),
                })
                if (!event) {
                    return new GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }

                console.log(input)

                const images = await uploadImageToFolder(
                    `${org_id}/${input.event}`,
                    input.file
                )

                const upload = images.map((set) => ({
                    mediaType: input.mediaType,
                    url: set.file,
                    eventId: event.id,
                }))

                const eventGallery = await db
                    .insert(eventsMedia)
                    .values(upload)
                    .returning()

                return eventGallery
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async addEventSponsors(
            _: any,
            { input }: addSponsorProps,
            context: any
        ) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)
                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.event)),
                })
                if (!event) {
                    return new GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    })
                }
                console.log(input)

                let cover
                if (input.sponsorLogo) {
                    cover = await upload(input.sponsorLogo)
                }
                const sponsor = await db
                    .insert(eventSponsors)
                    .values({
                        sponsorName: input.sponsorName,
                        sponsorLogo: cover ? cover : 'defaultEventCover.png',
                        sponsorShipId: input.sponsorShipId,
                        sponsorUserDesignation: input.sponsorUserDesignation,
                        sponsorUserName: input.sponsorUserName,
                        isApproved: true,
                        eventId: event.id,
                    })
                    .returning()

                const sponsors = await db.query.eventSponsors.findFirst({
                    where: and(eq(eventSponsors.id, sponsor[0].id)),
                    with: {
                        sponsorShip: true,
                    },
                })

                return sponsors
                // return agenda[0];
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async registerEvent(_: any, { input }: groupSlug, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })

                const ifExist = await db.query.eventsAttendees.findFirst({
                    where: and(
                        eq(eventsAttendees.eventId, event.id),
                        eq(eventsAttendees.alumni, id)
                    ),
                })
                if (ifExist) {
                    return new GraphQLError(
                        'You are AllReady Register for event',
                        {
                            extensions: {
                                code: 400,
                                http: { status: 400 },
                            },
                        }
                    )
                }
                const sponsor = await db
                    .insert(eventsAttendees)
                    .values({
                        eventId: event.id,
                        alumni: id,
                    })
                    .returning()

                return {
                    succuss: true,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async registerPaidEvent(_: any, { input }: groupSlug, context: any) {
            try {
                const { id } = await checkAuth(context)
                const org_id = await domainCheck(context)

                const event = await db.query.events.findFirst({
                    where: and(eq(events.slug, input.slug)),
                })

                const ifExist = await db.query.eventsAttendees.findFirst({
                    where: and(
                        eq(eventsAttendees.eventId, event.id),
                        eq(eventsAttendees.alumni, id)
                    ),
                })
                if (ifExist) {
                    return new GraphQLError(
                        'You are AllReady Register for event',
                        {
                            extensions: {
                                code: 400,
                                http: { status: 400 },
                            },
                        }
                    )
                }
                const sponsor = await db
                    .insert(eventsAttendees)
                    .values({
                        eventId: event.id,
                        alumni: id,
                    })
                    .returning()

                return {
                    succuss: true,
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    },
}

export { eventsResolvers }
