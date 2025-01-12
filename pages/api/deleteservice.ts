// myService 페이지에서 해당 유저가 선택한 서비스를 삭제하는 API
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../lib/mongoose';
import Service from '../models/Service';
import fs from 'fs';
import path from 'path';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { R2Client } from '../lib/r2';

const filesToDelete = [
  'index.html',
  'profile.webp',
  'carousel_1.webp',
  'carousel_2.webp',
  'carousel_3.webp',
  'data.json',
  'contact.json',
];

async function deleteR2Files(shortUrl: string) {
  try {
    const deleteParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Delete: { Objects: filesToDelete.map(file => ({ Key: `${shortUrl}/${file}` })) },
    };

    await R2Client.send(new DeleteObjectsCommand(deleteParams));
  } catch (error) {
    console.error('클라우드 파일삭제 중 오류 발생:', error);
    throw new Error('클라우드 파일삭제 중 오류 발생');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { encryptedUserId, serviceId, shortUrl } = req.body;

    try {
      const service = await Service.findOneAndDelete({ _id: serviceId, encryptedId: encryptedUserId, shortUrl });
      if (service) {
        // 서비스 폴더 및 파일 삭제
        const serviceFolderPath = path.join(process.cwd(), 'public', shortUrl);
        if (fs.existsSync(serviceFolderPath)) {
          fs.rmdirSync(serviceFolderPath, { recursive: true });
        }

        // R2 파일 삭제
        await deleteR2Files(shortUrl);

        res.status(200).json({ message: '서비스가 삭제되었습니다.' });
      } else {
        res.status(404).json({ error: '서비스를 찾을 수 없습니다.' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method} 이(가) 허용되지 않음`);
  }
}