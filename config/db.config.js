import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("mongo connected");
  } catch (error) {
    console.log("Error happens in database connection");
  }
};
