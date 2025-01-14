import { NextApiRequest, NextApiResponse } from 'next';
import { R2Client, BucketName } from '../lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Service from '../models/Service';
import connectDB from '../lib/mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { shortUrl, userId } = req.query;
  const jsonData = req.body;

  try {
    const service = await Service.findOne({ shortUrl });
    if (!service) {
      return res.status(404).json({ error: '서비스를 찾을 수 없습니다.' });
    }

    // api 요청 시, 암호화 된 userId 와 서비스의 encryptedId 가 일치하는지 확인
    if (service.encryptedId !== userId) {
      return res.status(403).json({ error: '접근이 거부되었습니다.' });
    }

    // 변동된 데이터를 CloudFlare R2에 저장
    const command = new PutObjectCommand({
      Bucket: BucketName,
      Key: `${shortUrl}/data.json`,
      Body: JSON.stringify(jsonData),
      ContentType: 'application/json',
    });
    await R2Client.send(command);
    res.status(200).json({ message: '저장되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
