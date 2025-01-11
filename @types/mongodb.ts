// @types/mongodb.ts
// pages/lib/mongoose.ts 에서 타입스크립트 타입오류 무시를 위한, 코드파일.
import { Mongoose } from "mongoose";

/* eslint-disable no-var */

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}