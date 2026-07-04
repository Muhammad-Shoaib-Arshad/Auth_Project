import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    const mongoUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/mern-auth";
    await mongoose.connect(mongoUrl);
  } catch (error) {
    console.error("Database Error:");
    console.error(error);
  }
};

export default connectDB;