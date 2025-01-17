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

    const imageKeys = [
      `${shortUrl}/carousel_1.webp`,
      `${shortUrl}/carousel_2.webp`,
      `${shortUrl}/carousel_3.webp`,
      `${shortUrl}/profile.webp`
    ];

    const imagePromises = imageKeys.map(async (key) => {
      try {
        const imageCommand = new GetObjectCommand({
          Bucket: BucketName,
          Key: key,
        });
        const imageResponse = await R2Client.send(imageCommand);
        const imageBody = await imageResponse.Body.transformToByteArray();
        const imageBase64 = Buffer.from(imageBody).toString('base64');
        return `data:image/webp;base64,${imageBase64}`;
      } catch (error) {
        return null;
      }
    });

    const images = await Promise.all(imagePromises);

    res.status(200).json({ images });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}