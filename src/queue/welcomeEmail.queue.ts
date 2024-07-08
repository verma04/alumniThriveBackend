import { Client, cacheExchange, fetchExchange } from '@urql/core'
const client = new Client({
    url: 'http://localhost:1000',
    exchanges: [cacheExchange, fetchExchange],
})

const QUERY = `
query Query($input: email) {
  sendEmail(input: $input) {
    status
  }
}
`
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
                console.log(result)
            })
    } catch (error) {
        console.log(error)
    }
}

export default welcomeEmail
