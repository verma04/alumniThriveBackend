"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const paymentsTypes = (0, apollo_server_core_1.gql) `
    type paymentSuccess {
        status: Boolean
    }
    type Query {
        checkPaymentDetails: PaymentDetails
    }

    input paymentDetails {
        enabledRazorpay: Boolean
        enabledStripe: Boolean
        razorpayKeyId: String
        razorpayKeySecret: String
        stripeKeyId: String
        stripeKeySecret: String
    }
    type PaymentDetails {
        enabledRazorpay: Boolean
        enabledStripe: Boolean
        razorpayKeyId: String
        razorpayKeySecret: String
        stripeKeyId: String
        stripeKeySecret: String
    }
    type Mutation {
        addPaymentDetails(input: paymentDetails): success
    }
`;
exports.paymentsTypes = paymentsTypes;
