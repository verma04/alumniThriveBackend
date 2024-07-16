"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alumni_types_1 = require("./alumni.types");
const alumniStories_types_1 = require("./alumniStories.types");
const campaign_types_1 = require("./campaign.types");
const chat_types_1 = require("./chat.types");
const directory_types_1 = require("./directory.types");
const events_types_1 = require("./events.types");
const feed_types_1 = require("./feed.types");
const feedback_types_1 = require("./feedback.types");
const group_types_1 = require("./group.types");
const issues_types_1 = require("./issues.types");
const jobs_types_1 = require("./jobs.types");
const marketPlace_types_1 = require("./marketPlace.types");
const media_types_1 = require("./media.types");
const mentorship_types_1 = require("./mentorship.types");
const organization_types_1 = require("./organization.types");
const profile_types_1 = require("./profile.types");
const types = [
    organization_types_1.organizationTypes,
    group_types_1.groupTypes,
    events_types_1.eventsTypes,
    media_types_1.mediaTypes,
    directory_types_1.directoryTypes,
    alumni_types_1.alumniTypes,
    feedback_types_1.feedbackTypes,
    jobs_types_1.jobsTypes,
    marketPlace_types_1.marketPlaceTypes,
    mentorship_types_1.mentorShipTypes,
    alumniStories_types_1.alumniStoriesTypes,
    campaign_types_1.campaignTypes,
    profile_types_1.profileTypes,
    group_types_1.groupTypes,
    feed_types_1.feedTypes,
    issues_types_1.issuesTypes,
    chat_types_1.chatTypes,
];
exports.default = types;
