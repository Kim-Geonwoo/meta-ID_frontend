import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../lib/mongoose';
import Service from '../models/Service';
import mongoose from 'mongoose';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { R2Client } from '../lib/r2';
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

// 파일 확장자에 따른 MIME 타입 설정
const mimeTypes: { [key: string]: string } = {
  '.html': 'text/html',
  '.webp': 'image/webp',
  '.json': 'application/json',
  // 필요한 경우 다른 MIME 타입 추가
};

const uploadFile = async (fileContent: Buffer, fileName: string, folderName: string) => {
  const ext = path.extname(fileName);
  const contentType = mimeTypes[ext] || 'application/octet-stream'; // 기본 콘텐츠 유형, 필요시 파일별로 수정

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${folderName}/${fileName}`,
    Body: fileContent,
    ContentType: contentType,
  });
  await R2Client.send(command);
  return fileName;
};



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { userId, name, description } = req.body;
    // 폴더지정
    const srcFolder = path.join(process.cwd(), 'public', 'sampleservice');

    // 글자 및 숫자로만 이루어져있는지 검증
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(userId) || !alphanumericRegex.test(name) || !alphanumericRegex.test(description)) {
      return res.status(400).json({ error: '페이로드는 글자 및 숫자로만 이루어져야 합니다.' });
    }

    try {
      const serviceId = generateRandomServiceId();
      const shortUrl = generateRandomFolderName();

      // 서비스 폴더 생성
      const destFolder = path.join(process.cwd(), 'public', shortUrl);
      copyFiles(srcFolder, destFolder);

      // 서비스 생성
      const newService = new Service({
        serviceId,
        encryptedId: userId,
        name,
        description,
        shortUrl,
      });
      await newService.save();

      // 파일 업로드
      const folderPath = join(process.cwd(), 'public', shortUrl);
      for (const file of filesToUpload) {
        const filePath = join(folderPath, file);
        const fileContent = readFileSync(filePath);
        await uploadFile(fileContent, file, shortUrl);
      }

      res.status(201).json({ message: '서비스가 생성되었습니다.', shortUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method} 이(가) 허용되지 않음`);
  }
}

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