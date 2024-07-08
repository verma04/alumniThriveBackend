import { issuesResolvers } from './issues'

const helpResolvers = {
    Query: {
        ...issuesResolvers.Query,
    },
    Mutation: {
        ...issuesResolvers.Mutation,
    },
}

export { helpResolvers }
