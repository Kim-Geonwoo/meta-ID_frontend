import { S3Client } from "@aws-sdk/client-s3";


const API_ROUTE_VALUE = process.env.R2_API_ROUTE_VALUE;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;


// 클라우드플레어 R2를 위한, S3 클라이언트 생성.
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${API_ROUTE_VALUE}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});



export const R2Client = S3;
export const BucketName = BUCKET_NAME;