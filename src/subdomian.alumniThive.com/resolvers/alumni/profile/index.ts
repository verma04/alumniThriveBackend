import { tagResolvers } from './tag.resolvers'

const profileResolvers = {
    Query: {
        ...tagResolvers.Query,
    },
    Mutation: {
        ...tagResolvers.Mutation,
    },
}

export { profileResolvers }
