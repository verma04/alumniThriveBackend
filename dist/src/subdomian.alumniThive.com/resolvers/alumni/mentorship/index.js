"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorShipResolvers = void 0;
const booking_reslovers_1 = require("./booking.reslovers");
const category_reslovers_1 = require("./category.reslovers");
const mentor_resolvers_1 = require("./mentor.resolvers");
const services_resolvers_1 = require("./services.resolvers");
const testimonial_resolvers_1 = require("./testimonial.resolvers");
const mentorShipResolvers = {
    Query: {
        ...category_reslovers_1.categoryResolvers.Query,
        ...services_resolvers_1.servicesResolvers.Query,
        ...testimonial_resolvers_1.testimonialsResolvers.Query,
        ...mentor_resolvers_1.mentorResolvers.Query,
        ...booking_reslovers_1.bookingResolvers.Query,
    },
    Mutation: {
        ...category_reslovers_1.categoryResolvers.Mutation,
        ...services_resolvers_1.servicesResolvers.Mutation,
        ...testimonial_resolvers_1.testimonialsResolvers.Mutation,
        ...booking_reslovers_1.bookingResolvers.Mutation,
    },
};
exports.mentorShipResolvers = mentorShipResolvers;
