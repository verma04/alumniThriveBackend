import { approvalResolvers } from './approval.resolvers'
import { interestsResolvers } from './interests.resolvers'
import { settingsResolvers } from './settings.resolvers'
import { themeResolvers } from './theme.resolvers'

const groupsResolvers = {
    Query: {
        ...themeResolvers.Query,
        ...interestsResolvers.Query,
        ...settingsResolvers.Query,
        ...approvalResolvers.Query,
    },
    Mutation: {
        ...themeResolvers.Mutation,
        ...interestsResolvers.Mutation,
        ...settingsResolvers.Mutation,
        ...approvalResolvers.Mutation,
    },
}

export default groupsResolvers
