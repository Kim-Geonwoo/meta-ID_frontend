// 서비스 생성시, 새로운 폴더를 생성 및 샘플폴더 내에서 파일복사,. 그리고, DB에 서비스 정보를 저장하는 API 코드파일.
import fs from 'fs';
import path from 'path';
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

// 임의의 영소문자 및 숫자 8자리로 조합된 서비스 ID 생성 함수
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
      // 폴더지정
      const srcFolder = path.join(process.cwd(), 'public', 'sampleservice');
      
      const shortUrl = generateRandomFolderName();
      const serviceId = generateRandomServiceId();

      // 서비스 폴더 생성
      const destFolder = path.join(process.cwd(), 'public', shortUrl);


      const encryptedId = userId;
      copyFiles(srcFolder, destFolder);
      
      // 서비스 정보를 DB에 저장
      const newService = new Service({
        serviceId,
        name,
        description,
        shortUrl,
        encryptedId,
      });

      await newService.save();


      res.status(200).json({ message: '서비스 생성완료!', shortUrl });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method} 이(가) 허용되지 않음`);
  }
}
