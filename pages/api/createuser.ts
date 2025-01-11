// 유저 가입시, DB에 유저정보 저장을 위한,. API 코드파일.
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../lib/mongoose';
import User from '../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { userid, username, email } = req.body;

    // 유저정보 DB에 저장
    try {
      const newUser = new User({
        userId: userid,
        username,
        email,
      });

      await newUser.save();

      res.status(200).json({ message: '회원가입이 완료되었습니다!', user: newUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method} 이(가) 허용되지 않음`);
  }
}