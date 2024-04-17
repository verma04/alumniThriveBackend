import moment from "moment";

import AWS from "aws-sdk";
const s3 = new AWS.S3({
  endpoint: "blr1.digitaloceanspaces.com",
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});
const uploadImageToFolder = async (id, images) => {
  // console.log(id, images);

  if (images.length === 0) {
    return [];
  }
  const img = images.map((set) => {
    const date = moment().format("YYYYMMDD");
    const randomString = Math.random().toString(36).substring(2, 7);

    const newFilename = `${id}/${date}-${randomString}`;

    return {
      img: set,
      file: newFilename,
    };
  });

  try {
    const arr = [];

    const params = await img.map(async (set) => {
      const { stream, filename, mimetype, encoding, createReadStream } =
        await set.img;

      const Body = await createReadStream();

      const params = {
        Bucket: "alumnithrive",
        Key: set.file,
        Body,
        ACL: "public-read",
        ContentType: mimetype,
      };

      const data1 = await s3.upload(params).promise();
      const { Location } = data1;

      return {
        country: filename,
      };
    });

    return img;
  } catch (error) {
    console.warn(error);
  }
};

export default uploadImageToFolder;
