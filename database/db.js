const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URI)
    console.info('MongoDB connected successfully');
  }catch(err) {
    console.error(
      'MongoDB failed to connect', 
      err.message
    );
  }
}

module.exports = connectToDB