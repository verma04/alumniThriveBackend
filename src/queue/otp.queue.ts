import { Client, cacheExchange, fetchExchange } from '@urql/core'
const client = new Client({
    url: 'http://localhost:1000',
    exchanges: [cacheExchange, fetchExchange],
})

const QUERY = `
query Query($input: inputOtpEmail) {
  sendOtpEmail(input: $input) {
    status
  }
}
`
const sendEmailOtp = async (email, otp) => {
    try {
        const data = client
            .query(QUERY, {
                input: {
                    email,
                    otp,
                },
            })
            .subscribe((result) => {
                console.log(result)
            })
    } catch (error) {
        console.log(error)
    }
}

export default sendEmailOtp
