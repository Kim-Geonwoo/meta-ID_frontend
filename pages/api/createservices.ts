import fs from 'fs';
import path from 'path';
import { encrypt } from '../lib/crypto'; // 경로 수정
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../lib/mongoose';
import Service from '../models/Service';

// 임의의 영소문자 및 숫자 6자리로 조합된 폴더 이름 생성 함수
function generateRandomFolderName(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomServiceId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


// 파일 복사 함수
function copyFiles(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory() ? copyFiles(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { userId, name, description } = req.body;

    try {
      const srcFolder = path.join(process.cwd(), 'public', 'sampleservice');
      const shortUrl = generateRandomFolderName();
      const serviceId = generateRandomServiceId();
      const destFolder = path.join(process.cwd(), 'public', shortUrl);

      const encryptedId = userId;
      copyFiles(srcFolder, destFolder);
      
      const newService = new Service({
        serviceId,
        name,
        description,
        shortUrl,
        encryptedId,
      });

      await newService.save();

      res.status(200).json({ message: 'Files copied successfully', shortUrl });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
