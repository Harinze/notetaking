import mongoose from "mongoose";

const connectToDB = async () => {
  const dbUri = process.env.MONGO_URI;;
    //const dbUri = process.env.MONGODB_TEST_DB;

  if (!dbUri) {
    console.error("❌ Database connection string is missing in environment variables.");
    return;
  }

  try {
    await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 20000, 
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

    if (error.name === "MongoNetworkError") {
      console.error(
        "Network error: Ensure your MongoDB server is running and accessible."
      );
    } else if (error.message.includes("ECONNREFUSED")) {
      console.error(
        "Connection refused: Check if the database server is reachable, and your IP is whitelisted (if using MongoDB Atlas)."
      );
    } else if (error.message.includes("Authentication failed")) {
      console.error(
        "Authentication failed: Verify your username and password in the connection string."
      );
    }
  }
};

export default connectToDB;

