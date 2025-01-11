// 유저 모델 정의
import mongoose, { Schema, models } from "mongoose";

export const userSchema = new Schema({
  _id: Schema.Types.ObjectId,

  userId: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  services: [{ // 무슨 이유인지, 작동하지 않음,.
    type: Schema.Types.ObjectId,
    ref: 'Service',
  }],
});

const User = models?.User || mongoose.model("User", userSchema);

export default User;
