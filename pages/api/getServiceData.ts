import { NextApiRequest, NextApiResponse } from 'next';
import { R2Client, BucketName } from '../lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import Service from '../models/Service';
import connectDB from '../lib/mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { shortUrl, userId } = req.query;

  try {
    const service = await Service.findOne({ shortUrl: { $eq: shortUrl } });
    if (!service) {
      return res.status(404).json({ error: '서비스를 찾을 수 없습니다.' });
    }

    if (service.encryptedId !== userId) {
      return res.status(403).json({ error: '접근이 거부되었습니다.' });
    }

    const command = new GetObjectCommand({
      Bucket: BucketName,
      Key: `${shortUrl}/data.json`,
    });
    const data = await R2Client.send(command);
    const bodyContents = await data.Body.transformToByteArray();
    const json = new TextDecoder().decode(bodyContents);
    res.status(200).json(JSON.parse(json));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
