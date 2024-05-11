import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

const connectMongoDB = async () => {
  try {
    if (cached.conn) return cached.conn;
    if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");
    cached.conn = await mongoose.connect(`${MONGODB_URI}`);
    return cached.conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
