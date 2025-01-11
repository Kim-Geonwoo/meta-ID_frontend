// pages/api/upload.js
// 추후, 파일 업로드를 위한 API 라우트를 구현필요
import { PutObjectCommand } from '@aws-sdk/client-s3'; // npm 패키지 미설치.
import { R2Client } from '../lib/r2client';
import { auth } from '../lib/firebaseClient';
import { readFileSync } from 'fs';
import { join } from 'path';




const filesToUpload = [
  'index.html',
  'profile.webp',
  'carousel_1.webp',
  'carousel_2.webp',
  'carousel_3.webp',
  'data.json',
  'contact.json',
];

const uploadFile = async (fileContent, fileName) => {
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_R2_BUCKET_NAME,
    Key: `sampleservice/${fileName}`,
    Body: fileContent,
    ContentType: 'application/octet-stream', // 기본 콘텐츠 유형, 필요시 파일별로 수정 가능
  });
  await R2Client.send(command);
  return fileName;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const idToken = req.headers.authorization.split('Bearer ')[1];
      const user = await auth.verifyIdToken(idToken);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const folderPath = join(process.cwd(), 'public', 'sampleservice');
      for (const file of filesToUpload) {
        const filePath = join(folderPath, file);
        const fileContent = readFileSync(filePath);
        await uploadFile(fileContent, file);
      }

      return res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}