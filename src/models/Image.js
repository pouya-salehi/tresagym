import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  images: [
    {
      url: String,
      category: {
        type: String,
        enum: ["front", "side", "back"],
        required: true,
      },
      title: {
        type: String,
        default: "بدن",
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "completed"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);
export default Image;
