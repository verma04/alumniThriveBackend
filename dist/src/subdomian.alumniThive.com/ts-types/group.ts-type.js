"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type;
(function (type) {
    type["virtual"] = "virtual";
    type["inPerson"] = "inPerson";
    type["hybrid"] = "hybrid";
})(type || (type = {}));
var reactionType;
(function (reactionType) {
    reactionType["like"] = "like";
    reactionType["celebrate"] = "celebrate";
    reactionType["support"] = "support";
    reactionType["love"] = "love";
    reactionType["insightful"] = "insightful";
    reactionType["funny"] = "funny";
})(reactionType || (reactionType = {}));
var visibility;
(function (visibility) {
    visibility["private"] = "private";
    visibility["public"] = "public";
})(visibility || (visibility = {}));
var joiningConditions;
(function (joiningConditions) {
    joiningConditions[joiningConditions["anyoneCanJoin"] = 0] = "anyoneCanJoin";
    joiningConditions[joiningConditions["adminOnlyAdd"] = 1] = "adminOnlyAdd";
})(joiningConditions || (joiningConditions = {}));
