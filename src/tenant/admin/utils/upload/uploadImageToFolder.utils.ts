import moment from 'moment'

import AWS from 'aws-sdk'
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const s3 = new AWS.S3({
    endpoint: 'blr1.digitaloceanspaces.com',
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
})
const uploadImageToFolder = async (id, images) => {
    // console.log(id, images);

    if (images.length === 0) {
        return []
    }
    const img = images.map((set) => {
        const date = moment().format('YYYYMMDD')
        const randomString = Math.random().toString(36).substring(2, 7)

        const newFilename = `${id}/${date}-${randomString}`

        return {
            img: set,
            file: newFilename,
        }
    })

    try {
        await img.map(async (set) => {
            const { filename, mimetype, createReadStream } = await set.img

            const Body = await createReadStream()

            const params = {
                Bucket: 'alumnithrive',
                Key: set.file,
                Body,
                ACL: 'public-read',
                ContentType: mimetype,
            }

            await s3.upload(params).promise()

            return {
                country: filename,
            }
        })

        return img
    } catch (error) {
        console.warn(error)
    }
}

export default uploadImageToFolder
