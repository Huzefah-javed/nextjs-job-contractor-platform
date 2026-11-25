"use server";

import { dbConnect } from "@/config/db.config";
import { users } from "@/schemas/user.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { sessions } from "@/schemas/session.schema";
import { redirect } from "next/dist/server/api-utils";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import mongoose from "mongoose";

export const loginUserAction = async (prevState, formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await dbConnect();

    const user = await users.findOne({
      $or: [
        { email: email.toLowerCase() },
        { companyEmail: email.toLowerCase() },
      ],
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const userSession = await sessions.create({ userId: user._id });
    const sessionToken = jwt.sign(
      { sessionId: userSession._id, userId: userSession.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1y" },
    );
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        profileStatus: user.profileStatus,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const cookieStore = await cookies();
    cookieStore.set("authCookie", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    cookieStore.set("sessionCookie", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 360 * 24 * 60 * 60,
    });

    return {
      success: true,
      message: "Login successful!",
      role: user.role,
    };
  } catch (error) {
    console.error("Login Error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export async function logoutAction() {
  console.log("Running ........ ");
  const cookieStore = await cookies();
  try {
    const res = await authAndGetUser();
    console.log("Running 1 ........", res);
    if (!res?.success) {
      return {
        success: false,
        message: "Unauthorized access or Already Logout",
      };
    }
    const anotherRes = await sessions.deleteMany({
      userId: new mongoose.Types.ObjectId(res.id),
    });
    console.log("anotherRes: ", anotherRes);
    cookieStore.delete("authCookie");
    cookieStore.delete("sessionCookie");
  } catch (error) {
    console.log(error);
    return { success: false, message: "something went wrong" };
  } finally {
    return { success: true, message: "Logout successfully" };
  }
}
