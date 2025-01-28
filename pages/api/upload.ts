import { NextApiRequest, NextApiResponse } from 'next';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { R2Client, BucketName } from '../lib/r2';
import { readFileSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join, extname } from 'path';
import sharp from 'sharp';
import connectDB from '../lib/mongoose';
import Service from '../models/Service';

const mimeTypes: { [key: string]: string } = {
  '.html': 'text/html',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

const uploadFile = async (fileContent: Buffer, fileName: string, folderName: string) => {
  const ext = extname(fileName);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: `${BucketName}`,
    Key: `${folderName}/${fileName}`,
    Body: fileContent,
    ContentType: contentType,
  });
  await R2Client.send(command);
  return fileName;
};

const processImage = async (base64Image: string) => {
  const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
  const processedImage = await sharp(buffer)
    .resize({ width: 500, height: 500, fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();
  return processedImage;
};

const generateRandomString = (length: number, chars: string) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomFolderName = () => generateRandomString(6, 'abcdefghijklmnopqrstuvwxyz0123456789');
const generateRandomServiceId = () => generateRandomString(8, 'abcdefghijklmnopqrstuvwxyz');

const copyFiles = (src: string, dest: string) => {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    entry.isDirectory() ? copyFiles(srcPath, destPath) : copyFileSync(srcPath, destPath);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { encryptUserId, name, description, data, contact, images } = req.body;

      const serviceId = generateRandomServiceId();
      const shortUrl = generateRandomFolderName();

      // index.html 복사하여 업로드
      const srcFolder = join(process.cwd(), 'public', 'sampleservice');
      const destFolder = join(process.cwd(), 'public', shortUrl);
      copyFiles(srcFolder, destFolder);

      // 서비스 생성
      const newService = new Service({
        serviceId,
        encryptedId: encryptUserId,
        name,
        description,
        shortUrl,
      });
      await newService.save();

      // 파일 업로드
      const indexPath = join(destFolder, 'index.html');
      const indexContent = readFileSync(indexPath);
      await uploadFile(indexContent, 'index.html', shortUrl);

      await uploadFile(Buffer.from(JSON.stringify(data, null, 2)), 'data.json', shortUrl);
      await uploadFile(Buffer.from(JSON.stringify(contact, null, 2)), 'contact.json', shortUrl);

      const imageNames = ['profile.webp', 'carousel_1.webp', 'carousel_2.webp', 'carousel_3.webp'];
      for (let i = 0; i < images.length; i++) {
        const processedImage = await processImage(images[i].fileContent);
        await uploadFile(processedImage, imageNames[i], shortUrl);
      }

      return res.status(201).json({ message: '서비스가 생성되었습니다.', shortUrl });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
