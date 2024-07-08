import { homePageResolvers } from './homepage.resolvers'

const websiteResolvers = {
    Query: {
        ...homePageResolvers.Query,
    },
    Mutation: {
        ...homePageResolvers.Mutation,
    },
}

export default websiteResolvers
