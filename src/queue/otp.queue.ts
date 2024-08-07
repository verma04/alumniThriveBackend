import { Client, cacheExchange, fetchExchange } from '@urql/core'
const client = new Client({
    url: process.env.QUEUE_PORT,
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
        console.log(otp)
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
