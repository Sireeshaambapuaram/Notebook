import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

// ------------- Database Connection ----------
const connectDB = async () => {
  try {
    await mongoose.connect(`${URI}/${DB_NAME}`);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection faild !!!: ", err);
  }
};

export default connectDB;