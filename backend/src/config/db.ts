import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-leads";
  let retries = 5;

  while (retries > 0) {
    try {
      console.log(`Connecting to MongoDB at: ${mongoURI}...`);
      await mongoose.connect(mongoURI);
      console.log("MongoDB Connected Successfully");
      break;
    } catch (err: any) {
      console.error(`MongoDB connection failed: ${err.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}. Waiting 5 seconds before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  if (mongoose.connection.readyState !== 1) {
    console.error("Failed to connect to MongoDB after multiple retries. Exiting...");
    process.exit(1);
  }
};

export default connectDB;
