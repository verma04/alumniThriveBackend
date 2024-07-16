"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const s3 = new aws_sdk_1.default.S3({
    endpoint: 'blr1.digitaloceanspaces.com',
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
});
const uploadFeedImage = async (id, images) => {
    // console.log(id, images);
    if (images.length === 0) {
        return [];
    }
    const img = images.map((set) => {
        const date = (0, moment_1.default)().format('YYYYMMDD');
        const randomString = Math.random().toString(36).substring(2, 7);
        const newFilename = `${id}/${date}-${randomString}}`;
        return {
            img: set,
            file: newFilename,
        };
    });
    try {
        await img.map(async (set) => {
            const { stream, filename, mimetype, encoding, createReadStream } = await set.img;
            const Body = await createReadStream();
            const params = {
                Bucket: 'alumnithrive',
                Key: set.file,
                Body,
                ACL: 'public-read',
                ContentType: mimetype,
            };
            const data1 = await s3.upload(params).promise();
            return {
                country: filename,
            };
        });
        return img;
    }
    catch (error) {
        console.warn(error);
    }
};
exports.default = uploadFeedImage;
