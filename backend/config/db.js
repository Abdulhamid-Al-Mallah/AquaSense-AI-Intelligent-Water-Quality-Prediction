const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true
    });
    console.log(`[AquaSense AI] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[AquaSense AI] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
