"use server";

import { dbConnect } from "@/config/db.config";
import { users } from "@/schemas/user.schema";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export const userProfileStatus = async (userId, status) => {
  try {
    await dbConnect();
    const objId = new mongoose.Types.ObjectId(userId);
    await users.findByIdAndUpdate(objId, { profileStatus: status });

    revalidatePath("/admin/userManagement");
  } catch (error) {
    console.error("Profile status error : ", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
