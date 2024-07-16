"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const upload = async (file) => {
    console.log(file);
    const s3 = new aws_sdk_1.default.S3({
        endpoint: 'blr1.digitaloceanspaces.com',
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
    });
    const { stream, filename, mimetype, encoding, createReadStream } = await file;
    const date = (0, moment_1.default)().format('YYYYMMDD');
    const randomString = Math.random().toString(36).substring(2, 7);
    const newFilename = `${date}-${randomString}`;
    const Body = createReadStream();
    try {
        const params = {
            Bucket: 'alumnithrive',
            Key: newFilename,
            Body,
            ACL: 'public-read',
            ContentType: mimetype,
        };
        const data1 = await s3.upload(params).promise();
        const { Location } = data1;
        return newFilename;
    }
    catch (error) {
        console.warn(error);
    }
};
exports.default = upload;
