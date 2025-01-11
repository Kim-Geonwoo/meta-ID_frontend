// DB 사용을 위한, mongoose 연결 코드파일 (현재 mongoDB Atlas 사용중)
import mongoose from 'mongoose';

// MongoDB Atlas 연결 URL
const url = process.env.NEXT_PUBLIC_DATABASE_URL_MONGO_DB;

// MongoDB Atlas 연결 URL이 없을 경우, 오류발생.
if (!url) {
  throw new Error('.env.local 파일 내에 MONGODB_URI 환경 변수를 정의하세요.');
}

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // 타입스크립트 문법오류 무시처리
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

// MongoDB 연결 함수
const connectDB = async () => {

  if (cached.conn) {
    console.log('MongoDB 연결 성공');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(url, {
        dbName: 'Cluster0', // 여기서 'Cluster0'은 MongoDB Atlas의 DB 이름
      })
      .then(mongoose => mongoose);
  }

  
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    console.error('MongoDB 연결 실패', err);
    throw new Error('MongoDB 연결 실패: ' + err.message);
  }

  return cached.conn;
};

export default connectDB;

