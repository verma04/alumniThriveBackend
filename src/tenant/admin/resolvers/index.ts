import { adminResolvers } from './admin/admin.resolvers'
import { organizationResolvers } from './admin/organization.resolvers'
import { GraphQLUpload } from 'graphql-upload'
import { userResolvers } from './admin/user.resolvers'
import { paymentResolvers } from './payments/payments.resolvers'
import { mentorShipResolvers } from './admin/mentorship.resolvers'
import { alumniStoriesResolvers } from './admin/alumnistories.resolvers'
import { givingResolvers } from './admin/giving.reslovers'
import websiteResolvers from './website'
import { domainResolvers } from './admin/domain.resolvers'
import groupsResolvers from './admin/group'
import { faqResolvers } from './admin/faq.resolvers'

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        ...adminResolvers.Query,
        ...organizationResolvers.Query,
        ...userResolvers.Query,
        ...paymentResolvers.Query,
        ...mentorShipResolvers.Query,
        ...alumniStoriesResolvers.Query,
        ...givingResolvers.Query,
        ...websiteResolvers.Query,
        ...domainResolvers.Query,
        ...groupsResolvers.Query,
        ...faqResolvers.Query,
    },
    Mutation: {
        ...adminResolvers.Mutation,
        ...organizationResolvers.Mutation,
        ...userResolvers.Mutation,
        ...paymentResolvers.Mutation,
        ...mentorShipResolvers.Mutation,
        ...alumniStoriesResolvers.Mutation,
        ...givingResolvers.Mutation,
        ...websiteResolvers.Mutation,
        ...domainResolvers.Mutation,
        ...groupsResolvers.Mutation,
        ...faqResolvers.Mutation,
    },
}

export default resolvers
