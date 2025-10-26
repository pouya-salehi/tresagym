// src/models/Profile.js
import { Schema, model, models } from "mongoose";

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: String,
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
  },
  idNumber: {
    type: String,
    default: 0,
    unique: true,
  },
  height: Number,
  weight: Number,
  bmi: Number,
  analyzed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending", // وقتی تازه ثبت‌نام کرده
  },
  program: [
    {
      type: Schema.Types.ObjectId,
      ref: "Program",
    },
  ],
});
delete models.Profile;
const Profile = models.Profile || model("Profile", profileSchema);
export default Profile;
