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
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service',
  }],
});

const User = models?.User || mongoose.model("User", userSchema);

export default User;
