// myService 페이지에서 해당 유저의 서비스 목록을 조회하는 API
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../lib/mongoose';
import Service from '../models/Service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { encryptedUserId } = req.body;

    try {
      // 해당 유저의 서비스 목록 조회 (암호화된 유저 UID로 조회)
      const services = await Service.find({ encryptedId: encryptedUserId }).select('name description shortUrl createdAt');
      res.status(200).json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method} 이(가) 허용되지 않음`);
  }
}