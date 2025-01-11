// 서비스 모델 정의
import mongoose, { Schema, models } from "mongoose";

export const serviceSchema = new Schema({
  
  serviceId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  encryptedId: {
    type: String,
    required: true,
  },
  UserId: { // 무슨 이유인지, 작동하지 않음,.
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Service = models?.Service || mongoose.model("Service", serviceSchema);

export default Service;
