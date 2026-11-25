import { dbConnect } from "@/config/db.config";
import { sessions } from "@/schemas/session.schema";
import { users } from "@/schemas/user.schema";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const fetchAuthData = async (userId) => {
  if (!userId) return null;
  await dbConnect();
  const objId = new mongoose.Types.ObjectId(userId);
  const user = await users.findById(objId);
  if (!user) return null;
  const data = {
    id: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
    profileStatus: user.profileStatus,
  };

  return data;
};

export const authenticatingUser = async (sessionId, userId) => {
  if (!userId || !sessionId) return false;
  await dbConnect();
  const userObjId = new mongoose.Types.ObjectId(userId);
  const sessionObjId = new mongoose.Types.ObjectId(sessionId);
  const sessionRes = await sessions.findOne({
    _id: sessionObjId,
    userId: userObjId,
  });
  if (!sessionRes) return false;
  return true;
};
