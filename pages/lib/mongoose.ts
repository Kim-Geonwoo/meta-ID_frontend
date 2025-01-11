import mongoose from 'mongoose';

const url = process.env.NEXT_PUBLIC_DATABASE_URL_MONGO_DB;

if (!url) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {

  if (cached.conn) {
    console.log('MongoDB 연결 성공');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(url, {
        dbName: 'Cluster0', // 여기서 'sample_mflix' 데이터베이스 명시
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

