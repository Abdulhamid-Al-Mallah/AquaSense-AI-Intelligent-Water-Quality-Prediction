import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using Mongoose.
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true
    });
    console.log(`[AquaSense AI] MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (connectionError) {
    console.error(`[AquaSense AI] MongoDB Connection Error: ${connectionError.message}`);
    process.exit(1);
  }
};

export default connectDB;
