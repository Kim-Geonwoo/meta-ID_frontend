import { PutObjectCommand } from '@aws-sdk/client-s3';
import { R2Client, BucketName } from '../lib/r2';
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

const uploadFile = async (fileContent, fileName, folderName) => {
  const command = new PutObjectCommand({
    Bucket: `${BucketName}`,
    Key: `${folderName}/${fileName}`,
    Body: fileContent,
    ContentType: 'application/octet-stream', // 기본 콘텐츠 유형, 필요시 파일별로 수정 가능
  });
  await R2Client.send(command);
  return fileName;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { folder } = req.body;
      const folderPath = join(process.cwd(), 'public', folder);
      for (const file of filesToUpload) {
        const filePath = join(folderPath, file);
        const fileContent = readFileSync(filePath);
        await uploadFile(fileContent, file, folder);
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