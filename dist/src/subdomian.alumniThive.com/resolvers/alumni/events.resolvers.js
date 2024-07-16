"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const _drizzle_1 = require("../../../@drizzle");
const domianCheck_1 = __importDefault(require("../../../commanUtils/domianCheck"));
const checkAuth_utils_1 = __importDefault(require("../../utils/auth/checkAuth.utils"));
const schema_1 = require("../../../@drizzle/src/db/schema");
const graphql_1 = require("graphql");
const slugify_1 = __importDefault(require("slugify"));
const upload_utils_1 = __importDefault(require("../../utils/upload/upload.utils"));
const uploadImageToFolder_utils_1 = __importDefault(require("../../../tenant/admin/utils/upload/uploadImageToFolder.utils"));
const Razorpay = require('razorpay');
const eventCondition = ({ mode, cost, org_id, search }) => {
    const conditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.organization, org_id), (0, drizzle_orm_1.eq)(schema_1.events.isApproved, false), (0, drizzle_orm_1.and)(!search || search?.length === 0
        ? (0, drizzle_orm_1.not)((0, drizzle_orm_1.ilike)(schema_1.events.name, `%${null}%`))
        : (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.events.name, `%${search}%`), (0, drizzle_orm_1.ilike)(schema_1.events.details, `%${search}%`)), mode ? (0, drizzle_orm_1.eq)(schema_1.events.eventType, mode) : (0, drizzle_orm_1.eq)(schema_1.events.organization, org_id), cost
        ? (0, drizzle_orm_1.eq)(schema_1.eventsPayments.eventCost, cost)
        : (0, drizzle_orm_1.eq)(schema_1.events.organization, org_id)));
    return conditions;
};
const eventsResolvers = {
    Query: {
        async getEventsType(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                return schema_1.eventTypesEnum?.enumValues;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getEventCostType(_, {}, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                return schema_1.eventCostTypeEnum?.enumValues;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllEvents(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(input);
                const { cost, search, offset, limit, mode } = input;
                const conditions = eventCondition({
                    mode,
                    cost,
                    org_id,
                    search,
                });
                const totalRecords = await _drizzle_1.db
                    .select({ count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number) })
                    .from(schema_1.events)
                    .leftJoin(schema_1.eventsPayments, (0, drizzle_orm_1.eq)(schema_1.events.id, schema_1.eventsPayments.eventId))
                    .where(conditions);
                const paginatedData = await _drizzle_1.db
                    .select({
                    events: schema_1.events,
                    eventsPayments: schema_1.eventsPayments,
                })
                    .from(schema_1.events)
                    .leftJoin(schema_1.eventsPayments, (0, drizzle_orm_1.eq)(schema_1.events.id, schema_1.eventsPayments.eventId))
                    .where(conditions)
                    .offset((offset - 1) * limit)
                    .limit(limit);
                console.log(paginatedData, search);
                return {
                    totalRecords: totalRecords[0].count,
                    data: paginatedData.map((set) => ({
                        ...set?.events,
                        eventsPayments: set.eventsPayments,
                    })),
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getEventBySlug(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const eventDetails = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
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
                const ifExist = await _drizzle_1.db.query.eventsAttendees.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsAttendees.eventId, eventDetails.id), (0, drizzle_orm_1.eq)(schema_1.eventsAttendees.alumni, id)),
                });
                return {
                    ...eventDetails,
                    eventCreator: {
                        ...eventDetails?.eventCreator?.alumni,
                        aboutAlumni: eventDetails?.eventCreator?.alumni?.aboutAlumni,
                    },
                    isRegistered: ifExist ? true : false,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getEventAsHost(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                console.log(id, org_id);
                const eventDetails = await _drizzle_1.db.query.eventHost.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventHost.alumniId, id), (0, drizzle_orm_1.eq)(schema_1.eventHost.organization, org_id)),
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
                return eventDetails.map((set) => ({
                    ...set?.event,
                    eventHost: {
                        role: set?.hostType,
                    },
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getEventSponsorship(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const eventDetails = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const eventSponsorship = await _drizzle_1.db.query.eventsSponsorShip.findMany({
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsSponsorShip.eventId, eventDetails.id)),
                    with: {
                        event: true,
                    },
                });
                return eventSponsorship;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllHost(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const host = await _drizzle_1.db.query.eventHost.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventHost.eventId, event.id)),
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
                return host.map((t) => ({
                    id: t.alumniId,
                    hostType: t.hostType,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                    alumni: t?.alumni?.alumni,
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllVenue(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const venue = await _drizzle_1.db.query.eventsVenue.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsVenue.eventId, event.id)),
                });
                return venue;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllSpeakers(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const speakers = await _drizzle_1.db.query.eventsSpeakers.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsVenue.eventId, event.id)),
                });
                return speakers;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getAllAgenda(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const speakers = await _drizzle_1.db.query.eventsAgenda.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsAgenda.eventId, event.id)),
                });
                return speakers;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getEventGallery(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const speakers = await _drizzle_1.db.query.eventsMedia.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsMedia.eventId, event.id)),
                });
                return speakers;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getEventSponsors(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                console.log(event);
                const sponsors = await _drizzle_1.db.query.eventSponsors.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventSponsors.eventId, event.id)),
                    with: {
                        sponsorShip: true,
                    },
                });
                return sponsors;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getSponsorshipEvents(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const eventDetails = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const eventSponsorship = await _drizzle_1.db.query.eventsSponsorShip.findMany({
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsSponsorShip.eventId, eventDetails.id)),
                });
                const eventSponsor = await _drizzle_1.db.query.eventSponsors.findMany({
                    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventSponsors.eventId, eventDetails.id)),
                    with: {
                        sponsorShip: true,
                    },
                });
                return {
                    eventSponsorship: eventSponsorship,
                    eventSponsors: eventSponsor,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getSpeakersEvents(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const speakers = await _drizzle_1.db.query.eventsSpeakers.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsVenue.eventId, event.id)),
                });
                return speakers;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async getPaidEventsDetails(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const org = await (0, domianCheck_1.default)(context);
                console.log(input, org);
                // const paymentDetails = await db.query.razorpay.findFirst({
                //   where: and(eq(razorpay.organization, org)),
                // });
                // console.log(paymentDetails, "dssd");
                const razorpayDetials = await _drizzle_1.db.query.organization.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.organization.id, org),
                    with: {
                        razorpay: true,
                    },
                });
                console.log(razorpayDetials);
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
                });
                const options = {
                    amount: 4000,
                    currency: 'INR',
                    receipt: 'any unique id for every order',
                    payment_capture: 1,
                };
                const response = await razorpay.orders.create(options);
                return {
                    orderId: response.id,
                    currency: response.currency,
                    amount: response.amount,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        async createEventForGroup(_, { input }, context) {
            try {
                let cover;
                // await db.delete(eventsPayments);
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                if (input?.cover) {
                    cover = await (0, upload_utils_1.default)(input.cover);
                }
                const find = await _drizzle_1.db.query.groups.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.id, input.group)),
                });
                if (!find) {
                    return new graphql_1.GraphQLError('No Group found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                let slug = (0, slugify_1.default)(input.name, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                });
                const findEvent = await _drizzle_1.db.query.events.findFirst({
                    where: (events, { eq }) => eq(events.slug, slug),
                });
                if (findEvent) {
                    const val = Math.floor(1000 + Math.random() * 9000);
                    slug = slug + '-' + val;
                }
                const createEvents = await _drizzle_1.db
                    .insert(schema_1.events)
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
                    .returning();
                await _drizzle_1.db.insert(schema_1.eventsPayments).values({
                    eventCost: input.eventCost,
                    costPerAdults: input.costPerAdults,
                    costPerChildren: input.costPerChildren,
                    eventId: createEvents[0].id,
                });
                await _drizzle_1.db.insert(schema_1.eventsOrganizer).values({
                    contactEmail: input.contactEmail,
                    contactNumber: input.contactNumber,
                    eventId: createEvents[0].id,
                });
                const eventDetails = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.id, createEvents[0].id)),
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
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async createEvent(_, { input }, context) {
            try {
                let cover;
                // await db.delete(eventsPayments);
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                if (input?.cover) {
                    cover = await (0, upload_utils_1.default)(input.cover);
                }
                let slug = (0, slugify_1.default)(input.name, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true,
                });
                const findEvent = await _drizzle_1.db.query.events.findMany({
                    where: (events, { eq }) => eq(events.slug, slug),
                });
                if (findEvent) {
                    const val = Math.floor(1000 + Math.random() * 9000);
                    slug = slug + '-' + val;
                }
                const createEvents = await _drizzle_1.db
                    .insert(schema_1.events)
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
                    .returning();
                await _drizzle_1.db.insert(schema_1.eventsPayments).values({
                    eventCost: input.eventCost,
                    costPerAdults: input.costPerAdults,
                    costPerChildren: input.costPerChildren,
                    eventId: createEvents[0].id,
                });
                await _drizzle_1.db.insert(schema_1.eventsOrganizer).values({
                    contactEmail: input.contactEmail,
                    contactNumber: input.contactNumber,
                    eventId: createEvents[0].id,
                });
                await _drizzle_1.db.insert(schema_1.eventHost).values({
                    alumniId: id,
                    hostType: 'host',
                    eventId: createEvents[0].id,
                    organization: org_id,
                });
                const eventDetails = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.id, createEvents[0].id)),
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
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addSponsorShip(_, { input }, context) {
            try {
                const eventDetails = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                if (!eventDetails) {
                    return new graphql_1.GraphQLError('No Event found', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const sponsor = await _drizzle_1.db
                    .insert(schema_1.eventsSponsorShip)
                    .values({
                    eventId: eventDetails.id,
                    sponsorType: input.type,
                    price: input.price,
                    currency: input.currency,
                    content: input.content,
                    showPrice: input.showPrice,
                })
                    .returning();
                return sponsor[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async deleteSponsorShip(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                const deleteSponsorShip = await _drizzle_1.db
                    .delete(schema_1.eventsSponsorShip)
                    .where((0, drizzle_orm_1.eq)(schema_1.eventsSponsorShip.id, input.id))
                    .returning();
                return deleteSponsorShip[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addHost(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                const org = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.event)),
                });
                const checkHost = await _drizzle_1.db.query.eventHost.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventHost.alumniId, input.id), (0, drizzle_orm_1.eq)(schema_1.eventHost.eventId, event.id)),
                });
                if (checkHost) {
                    return new graphql_1.GraphQLError('Event Host AllReady Added', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const createHost = await _drizzle_1.db
                    .insert(schema_1.eventHost)
                    .values({
                    organization: org,
                    alumniId: input.id,
                    hostType: 'co-host',
                    eventId: event.id,
                })
                    .returning();
                return createHost[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async removeHost(_, { input }, context) {
            try {
                await (0, checkAuth_utils_1.default)(context);
                await (0, domianCheck_1.default)(context);
                console.log(input);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.event)),
                });
                const checkHost = await _drizzle_1.db.query.eventHost.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventHost.alumniId, input.id), (0, drizzle_orm_1.eq)(schema_1.eventHost.eventId, event.id)),
                });
                if (checkHost) {
                    const deleteHost = await await _drizzle_1.db
                        .delete(schema_1.eventHost)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventHost.alumniId, input.id), (0, drizzle_orm_1.eq)(schema_1.eventHost.eventId, event.id)))
                        .returning();
                    return deleteHost;
                }
                return new graphql_1.GraphQLError('No Event Found', {
                    extensions: {
                        code: 400,
                        http: { status: 400 },
                    },
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addVenue(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.event)),
                });
                if (!event) {
                    return new graphql_1.GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const createVenue = await _drizzle_1.db
                    .insert(schema_1.eventsVenue)
                    .values({
                    venue: input.venue,
                    address: input.address,
                    eventId: event.id,
                })
                    .returning();
                return createVenue[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addEventSpeaker(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.event)),
                });
                if (!event) {
                    return new graphql_1.GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                console.log(input);
                if (input.type === 'internal') {
                    const speaker = await _drizzle_1.db.query.alumniToOrganization.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.alumniToOrganization.alumniId, input.speaker)),
                        with: {
                            alumni: {
                                with: {
                                    aboutAlumni: true,
                                },
                            },
                        },
                    });
                    const createSpeaker = await _drizzle_1.db
                        .insert(schema_1.eventsSpeakers)
                        .values({
                        fullName: `${speaker.alumni.firstName} ${speaker.alumni.lastName} `,
                        about: speaker.alumni.aboutAlumni.currentPosition,
                        avatar: speaker.alumni.avatar,
                        eventId: event.id,
                    })
                        .returning();
                    return createSpeaker[0];
                }
                else {
                    let cover;
                    if (input?.cover) {
                        cover = await (0, upload_utils_1.default)(input.cover);
                    }
                    const createSpeaker = await _drizzle_1.db
                        .insert(schema_1.eventsSpeakers)
                        .values({
                        fullName: input.name,
                        about: input.about,
                        linkedin: input.linkedin,
                        avatar: cover ? cover : 'defaultEventCover.png',
                        eventId: event.id,
                    })
                        .returning();
                    return createSpeaker[0];
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
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addEventAgenda(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.event)),
                });
                if (!event) {
                    return new graphql_1.GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const agenda = await _drizzle_1.db
                    .insert(schema_1.eventsAgenda)
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
                    .returning();
                return agenda[0];
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
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addEventMedia(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.event)),
                });
                if (!event) {
                    return new graphql_1.GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                console.log(input);
                const images = await (0, uploadImageToFolder_utils_1.default)(`${org_id}/${input.event}`, input.file);
                const upload = images.map((set) => ({
                    mediaType: input.mediaType,
                    url: set.file,
                    eventId: event.id,
                }));
                const eventGallery = await _drizzle_1.db
                    .insert(schema_1.eventsMedia)
                    .values(upload)
                    .returning();
                return eventGallery;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async addEventSponsors(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.event)),
                });
                if (!event) {
                    return new graphql_1.GraphQLError('SomeThing went Wrong', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                console.log(input);
                let cover;
                if (input.sponsorLogo) {
                    cover = await (0, upload_utils_1.default)(input.sponsorLogo);
                }
                const sponsor = await _drizzle_1.db
                    .insert(schema_1.eventSponsors)
                    .values({
                    sponsorName: input.sponsorName,
                    sponsorLogo: cover ? cover : 'defaultEventCover.png',
                    sponsorShipId: input.sponsorShipId,
                    sponsorUserDesignation: input.sponsorUserDesignation,
                    sponsorUserName: input.sponsorUserName,
                    isApproved: true,
                    eventId: event.id,
                })
                    .returning();
                const sponsors = await _drizzle_1.db.query.eventSponsors.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventSponsors.id, sponsor[0].id)),
                    with: {
                        sponsorShip: true,
                    },
                });
                return sponsors;
                // return agenda[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async registerEvent(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const ifExist = await _drizzle_1.db.query.eventsAttendees.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsAttendees.eventId, event.id), (0, drizzle_orm_1.eq)(schema_1.eventsAttendees.alumni, id)),
                });
                if (ifExist) {
                    return new graphql_1.GraphQLError('You are AllReady Register for event', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const sponsor = await _drizzle_1.db
                    .insert(schema_1.eventsAttendees)
                    .values({
                    eventId: event.id,
                    alumni: id,
                })
                    .returning();
                return {
                    succuss: true,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
        async registerPaidEvent(_, { input }, context) {
            try {
                const { id } = await (0, checkAuth_utils_1.default)(context);
                const org_id = await (0, domianCheck_1.default)(context);
                const event = await _drizzle_1.db.query.events.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.slug, input.slug)),
                });
                const ifExist = await _drizzle_1.db.query.eventsAttendees.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.eventsAttendees.eventId, event.id), (0, drizzle_orm_1.eq)(schema_1.eventsAttendees.alumni, id)),
                });
                if (ifExist) {
                    return new graphql_1.GraphQLError('You are AllReady Register for event', {
                        extensions: {
                            code: 400,
                            http: { status: 400 },
                        },
                    });
                }
                const sponsor = await _drizzle_1.db
                    .insert(schema_1.eventsAttendees)
                    .values({
                    eventId: event.id,
                    alumni: id,
                })
                    .returning();
                return {
                    succuss: true,
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
exports.eventsResolvers = eventsResolvers;
