"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking')
const domainTypes = (0, apollo_server_core_1.gql) `
    type domain {
        domain: String
        dnsConfig: Boolean
        ssl: Boolean
        status: Boolean
        organization: ID
    }
    type Query {
        getCustomDomain: domain
        checkDomainIsVerified: domain
    }
    input inputDomain {
        domain: String!
    }
    type Mutation {
        deleteDomain: domain
        updateDomain(input: inputDomain): domain
    }
`;
exports.domainTypes = domainTypes;
