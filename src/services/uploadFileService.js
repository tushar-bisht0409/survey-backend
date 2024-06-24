// const AWS = require('@aws-sdk/client-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');



exports.uploadFile = async (file, oKey) => {
  try {

const s3Client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: `https://${process.env.REGION}.digitaloceanspaces.com`,
  region: 'blr1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});
await s3Client.send(new PutObjectCommand({
  Bucket: process.env.BUCKET,
  Key: oKey,
  Body: Buffer.from(file.buffer),
  ACL: 'public-read',
  ContentType: file.mimetype,
}));


    return { success: true, url: `https://${process.env.BUCKET}.${process.env.REGION}.digitaloceanspaces.com/${oKey}` };
  } catch (error) {
    return { success: false, error };
  }
};