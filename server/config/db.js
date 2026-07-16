
const mongoose = require('mongoose');

/**
 * Connects the Node.js / Express application to MongoDB.
 * Note: Since you're not connecting to Mongo Atlas yet, this function prepares the connection structure.
 * When you're ready, simply populate your MONGODB_URI in the .env file and call this function in server.js.
 */
const connectDB = async () => {
  try {
    // We retrieve the database connection string from our environment variables
    const dbURI = process.env.MONGODB_URI;

    if (!dbURI) {
      console.warn(
        'WARNING: MONGODB_URI environment variable is not defined in your .env file.\n' +
        'Mongoose connection skipped. Ensure you set MONGODB_URI before connecting to database.'
      );
      return;
    }

    // Attempt to establish a connection to MongoDB
    const conn = await mongoose.connect(dbURI);

    console.log(`========================================================`);
    console.log(`✓ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`========================================================`);
  } catch (error) {
    console.error(`========================================================`);
    console.error(`✗ Error connecting to MongoDB: ${error.message}`);
    console.error(`Make sure your MongoDB server is running or your URI is correct.`);
    console.log(`========================================================`);
    
    // Exit process with failure code if connection fails
    return
  }
};

module.exports = connectDB;
