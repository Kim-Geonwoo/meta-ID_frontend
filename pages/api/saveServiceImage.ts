import { NextApiRequest, NextApiResponse } from 'next';
import { R2Client, BucketName } from '../lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Service from '../models/Service';
import connectDB from '../lib/mongoose';
import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { shortUrl, userId, imageIndex } = req.query;

  try {
    const service = await Service.findOne({ shortUrl: { $eq: shortUrl } });
    if (!service) {
      return res.status(404).json({ error: '서비스를 찾을 수 없습니다.' });
    }

    // api 요청 시, 암호화 된 userId 와 서비스의 encryptedId 가 일치하는지 확인
    if (service.encryptedId !== userId) {
      return res.status(403).json({ error: '접근이 거부되었습니다.' });
    }

    const imageKeys = [
      `${shortUrl}/carousel_1.webp`,
      `${shortUrl}/carousel_2.webp`,
      `${shortUrl}/carousel_3.webp`,
      `${shortUrl}/profile.webp`
    ];

    const imageKey = imageKeys[Number(imageIndex)];

    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: '파일 업로드 중 오류가 발생했습니다.' });
      }

      const imageFile = files.image;
      if (!imageFile) {
        return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
      }

      const imageBuffer = await fs.promises.readFile(imageFile[0].filepath);

      // 이미지를 WebP로 변환하고 압축하며, 1:1 비율로 조정
      const transformedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 500, height: 500, fit: 'cover' }) // 1:1 비율로 조정
        .webp({ quality: 80 }) // WebP로 변환 및 압축
        .toBuffer();

      const putCommand = new PutObjectCommand({
        Bucket: BucketName,
        Key: imageKey,
        Body: transformedImageBuffer,
        ContentType: 'image/webp',
      });

      await R2Client.send(putCommand);

      res.status(200).json({ message: '이미지 저장을 완료하였습니다.' });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}