"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorshipSkills = exports.mentorshipCategoryRelations = exports.mentorshipCategory = exports.servicesRelations = exports.mentorShipService = exports.mentorShipBookingRelations = exports.mentorShipBooking = exports.mentorShipTestimonialRelations = exports.mentorShipTestimonials = exports.mentorShipRelations = exports.mentorShip = exports.servicesPriceType = exports.requestStatus = exports.mentorServicesType = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const tenant_1 = require("../tenant");
const alumni_1 = require("./alumni");
exports.mentorServicesType = (0, pg_core_1.pgEnum)('mentorServicesType', [
    '1:1 call',
    'subscription',
    'webinar',
]);
exports.requestStatus = (0, pg_core_1.pgEnum)('mentorShipRequestStatus', [
    'ACCEPTED',
    'REJECTED',
    'CANCEL',
]);
exports.servicesPriceType = (0, pg_core_1.pgEnum)('servicesPriceType', ['free', 'paid']);
exports.mentorShip = (0, pg_core_1.pgTable)('mentorship', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    mentorshipCategory: (0, pg_core_1.uuid)('mentorshipCategory').notNull(),
    user: (0, pg_core_1.uuid)('alumni_id').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    displayName: (0, pg_core_1.text)('displayName').notNull(),
    isApproved: (0, pg_core_1.boolean)('isApproved').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    intro: (0, pg_core_1.text)('intro'),
    about: (0, pg_core_1.text)('about'),
    introVideo: (0, pg_core_1.text)('introVideo'),
    featuredArticle: (0, pg_core_1.text)('featuredArticle'),
    whyDoWantBecomeMentor: (0, pg_core_1.text)('whyDoWantBecomeMentor'),
    greatestAchievement: (0, pg_core_1.text)('greatestAchievement'),
    availability: (0, pg_core_1.json)('availability').notNull(),
    agreement: (0, pg_core_1.boolean)('agreement').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.mentorShipRelations = (0, drizzle_orm_1.relations)(exports.mentorShip, ({ one, many }) => ({
    organization: one(tenant_1.organization, {
        fields: [exports.mentorShip.organization],
        references: [tenant_1.organization.id],
    }),
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.mentorShip.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    category: one(exports.mentorshipCategory, {
        fields: [exports.mentorShip.mentorshipCategory],
        references: [exports.mentorshipCategory.id],
    }),
    mentorShipTestimonial: many(exports.mentorShipTestimonials),
    services: many(exports.mentorShipService),
}));
exports.mentorShipTestimonials = (0, pg_core_1.pgTable)('mentorShipTestimonial', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    testimonial: (0, pg_core_1.text)('testimonial').notNull(),
    from: (0, pg_core_1.text)('from').notNull(),
    mentorShip: (0, pg_core_1.uuid)('mentorship_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.mentorShipTestimonialRelations = (0, drizzle_orm_1.relations)(exports.mentorShipTestimonials, ({ one, many }) => ({
    mentorship: one(exports.mentorShip, {
        fields: [exports.mentorShipTestimonials.mentorShip],
        references: [exports.mentorShip.id],
    }),
}));
exports.mentorShipBooking = (0, pg_core_1.pgTable)('mentorBooking', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    razorpay_order_id: (0, pg_core_1.text)('razorpay_order_id'),
    razorpay_payment_id: (0, pg_core_1.text)('razorpay_payment_id'),
    razorpay_signature: (0, pg_core_1.text)('razorpay_signature'),
    user: (0, pg_core_1.uuid)('alumni_id').notNull(),
    mentor: (0, pg_core_1.uuid)('mentor_id').notNull(),
    service: (0, pg_core_1.uuid)('service_id').notNull(),
    amount: (0, pg_core_1.numeric)('amount'),
    payment: (0, pg_core_1.boolean)('payment').notNull(),
    isAccepted: (0, pg_core_1.boolean)('isAccepted').default(false).notNull(),
    isCompleted: (0, pg_core_1.boolean)('isCompleted').default(false).notNull(),
    isCancel: (0, pg_core_1.boolean)('isCancel').default(false).notNull(),
    requestStatus: (0, exports.requestStatus)('requestStatus'),
    url: (0, pg_core_1.text)('url'),
    paymentId: (0, pg_core_1.uuid)('payment_id'),
});
exports.mentorShipBookingRelations = (0, drizzle_orm_1.relations)(exports.mentorShipBooking, ({ one, many }) => ({
    user: one(alumni_1.alumniToOrganization, {
        fields: [exports.mentorShipBooking.user],
        references: [alumni_1.alumniToOrganization.alumniId],
    }),
    service: one(exports.mentorShipService, {
        fields: [exports.mentorShipBooking.service],
        references: [exports.mentorShipService.id],
    }),
    mentor: one(exports.mentorShip, {
        fields: [exports.mentorShipBooking.mentor],
        references: [exports.mentorShip.id],
    }),
    payments: one(exports.mentorShip, {
        fields: [exports.mentorShipBooking.mentor],
        references: [exports.mentorShip.id],
    }),
}));
exports.mentorShipService = (0, pg_core_1.pgTable)('mentorShipService', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    serviceType: (0, exports.mentorServicesType)('mentorServicesType').notNull(),
    priceType: (0, exports.servicesPriceType)('servicesPriceType').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    duration: (0, pg_core_1.numeric)('duration').notNull(),
    price: (0, pg_core_1.numeric)('price'),
    shortDescription: (0, pg_core_1.text)('shortDescription'),
    description: (0, pg_core_1.text)('description'),
    webinarUrl: (0, pg_core_1.text)('webinarUrl'),
    mentorShip: (0, pg_core_1.uuid)('mentorship_id').notNull(),
    webinarDate: (0, pg_core_1.text)('webinarDate'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.servicesRelations = (0, drizzle_orm_1.relations)(exports.mentorShipService, ({ one, many }) => ({
    mentorship: one(exports.mentorShip, {
        fields: [exports.mentorShipService.mentorShip],
        references: [exports.mentorShip.id],
    }),
}));
exports.mentorshipCategory = (0, pg_core_1.pgTable)('mentorshipCategory', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.mentorshipCategoryRelations = (0, drizzle_orm_1.relations)(exports.mentorshipCategory, ({ one, many }) => ({
    mentorShip: many(exports.mentorShip),
    organization: one(tenant_1.organization, {
        fields: [exports.mentorshipCategory.organization],
        references: [tenant_1.organization.id],
    }),
}));
exports.mentorshipSkills = (0, pg_core_1.pgTable)('mentorshipSkills', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    organization: (0, pg_core_1.uuid)('org_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
