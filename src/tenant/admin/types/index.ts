import { adminTypes } from './admin.types'
import { alumniStoriesTypes } from './alumnistories.types'
import { domainTypes } from './domain.types'
import { faqTypes } from './faq.types'
import { givingTypes } from './giving.types'
import groupTypes from './group'
import { mentorShipTypes } from './mentorship.types'
import { organizationTypes } from './organization.types'
import { paymentsTypes } from './payments.types'
import { userTypes } from './user.types'
import websiteTypes from './website'

const types = [
    adminTypes,
    organizationTypes,
    userTypes,
    paymentsTypes,
    mentorShipTypes,
    alumniStoriesTypes,
    givingTypes,
    websiteTypes,
    domainTypes,
    groupTypes,
    faqTypes,
]

export default types
