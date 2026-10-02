import mongoose from 'mongoose';

export default async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing. Add it to server/.env');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
