import { gql } from 'apollo-server-core'

// const { Parking } = require('../models/Parking')
const settingTypes = gql`
    type groupSetting {
        autoApprove: Boolean
        views: Boolean
        discussion: Boolean
        user: Boolean
    }
    type Query {
        getGroupSettings: groupSetting
    }

    input updateSettings {
        autoApprove: Boolean
        views: Boolean
        discussion: Boolean
        user: Boolean
    }

    type Mutation {
        updateGroupSettings(input: updateSettings): groupSetting
    }
`

export { settingTypes }
