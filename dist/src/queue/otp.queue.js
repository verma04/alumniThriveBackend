"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@urql/core");
const client = new core_1.Client({
    url: 'http://localhost:1000',
    exchanges: [core_1.cacheExchange, core_1.fetchExchange],
});
const QUERY = `
query Query($input: inputOtpEmail) {
  sendOtpEmail(input: $input) {
    status
  }
}
`;
const sendEmailOtp = async (email, otp) => {
    try {
        console.log(otp);
        const data = client
            .query(QUERY, {
            input: {
                email,
                otp,
            },
        })
            .subscribe((result) => {
            console.log(result);
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = sendEmailOtp;
