import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  program: {
    type: [String],
    ref: "Program",
    default: "",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  otp: {
    type: String,
  },
  otpExpire: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  isApproved: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    default: null,
  },
});
delete models.User;
const User = models.User || model("User", userSchema);
export default User;
