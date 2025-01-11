// 클라우드플레어 R2 파일 업로드를 위한, 초기화 코드파일,.
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // npm 패키지 미설치.
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const REGION = 'auto'; // R2는 자동으로 지역을 설정합니다.
const r2Client = new S3Client({
  region: REGION,
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

export const uploadToR2 = async (folderPath, bucketName) => {
  const files = readdirSync(folderPath);
  for (const file of files) {
    const filePath = join(folderPath, file);
    const fileContent = readFileSync(filePath);

    const params = {
      Bucket: bucketName,
      Key: `sampleservice/${file}`,
      Body: fileContent,
    };

    const command = new PutObjectCommand(params);
    try {
      await r2Client.send(command);
      console.log(`Uploaded ${file} to ${bucketName}`);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err);
    }
  }
};