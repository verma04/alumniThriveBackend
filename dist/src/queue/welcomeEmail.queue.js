"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@urql/core");
const client = new core_1.Client({
    url: 'http://localhost:1000',
    exchanges: [core_1.cacheExchange, core_1.fetchExchange],
});
const QUERY = `
query Query($input: email) {
  sendEmail(input: $input) {
    status
  }
}
`;
const welcomeEmail = async (email, name) => {
    try {
        const data = client
            .query(QUERY, {
            input: {
                email,
                subject: 'Thank you for signing up. Get started.',
                name,
                type: 'welcome',
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
exports.default = welcomeEmail;
