import { loginResolvers } from './admin/login.resolvers'

const resolvers = {
    Query: {
        ...loginResolvers.Query,
    },
    Mutation: {
        ...loginResolvers.Mutation,
    },
}

export default resolvers
