import { bookingResolvers } from './booking.reslovers'
import { categoryResolvers } from './category.reslovers'
import { mentorResolvers } from './mentor.resolvers'
import { servicesResolvers } from './services.resolvers'
import { testimonialsResolvers } from './testimonial.resolvers'

const mentorShipResolvers = {
    Query: {
        ...categoryResolvers.Query,
        ...servicesResolvers.Query,
        ...testimonialsResolvers.Query,
        ...mentorResolvers.Query,
        ...bookingResolvers.Query,
    },
    Mutation: {
        ...categoryResolvers.Mutation,
        ...servicesResolvers.Mutation,
        ...testimonialsResolvers.Mutation,
        ...bookingResolvers.Mutation,
    },
}

export { mentorShipResolvers }
