import mongoose from "mongoose";

export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to data base");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}
