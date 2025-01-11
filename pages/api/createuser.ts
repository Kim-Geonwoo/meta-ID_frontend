import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../lib/mongoose';
import User from '../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { userid, username, email } = req.body;

    try {
      const newUser = new User({
        userId: userid,
        username,
        email,
      });

      await newUser.save();

      res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}