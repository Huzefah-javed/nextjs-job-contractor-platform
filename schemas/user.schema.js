import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["freelancer", "client"],
  },
  profileStatus: {
    type: String,
    default: false,
  },
  region: {
    type: String,
    default: "California",
  },
});

export const users = model("user", userSchema);
