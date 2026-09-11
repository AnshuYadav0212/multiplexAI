import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.CHAT_MONGODB_URI);
    console.log("Connected to Authentication MongoDB");
  } catch (error) {
    console.error("Error connecting to Authentication MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
