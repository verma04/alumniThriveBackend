import moment from "moment";
import React from "react";
import AWS from "aws-sdk";
const upload = async (file) => {
  const s3 = new AWS.S3({
    endpoint: "blr1.digitaloceanspaces.com",
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  });
  const { stream, filename, mimetype, encoding, createReadStream } = await file;

  console.log(file);

  const date = moment().format("YYYYMMDD");
  const randomString = Math.random().toString(36).substring(2, 7);

  const newFilename = `${date}-${randomString}}`;

  const Body = createReadStream();

  try {
    const params = {
      Bucket: "alumnithrive",
      Key: newFilename,
      Body,
      ACL: "public-read",
      ContentType: mimetype,
    };
    const data1 = await s3.upload(params).promise();
    const { Location } = data1;

    return newFilename;
  } catch (error) {
    console.warn(error);
  }
};

export default upload;
