import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.AGENT_MONGODB_URI);
    console.log("Connected to Agent MongoDB");
  } catch (error) {
    console.error("Error connecting to Agent MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
