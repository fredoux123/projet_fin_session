import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

export async function connectToDatabase() {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not set');
  }
  if (mongoose.connection.readyState !== 0) {
    return mongoose.connection;
  }
  await mongoose.connect(MONGO_URL);
  return mongoose.connection;
}
