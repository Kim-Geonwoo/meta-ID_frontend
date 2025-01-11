import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../lib/mongoose';
import Service from '../models/Service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { encryptedUserId } = req.body;

    try {
      const services = await Service.find({ encryptedId: encryptedUserId }).select('name description shortUrl createdAt');
      res.status(200).json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}