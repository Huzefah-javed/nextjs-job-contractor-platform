"use server";

import { dbConnect } from "@/config/db.config";
import { users } from "@/schemas/user.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { sessions } from "@/schemas/session.schema";

export const loginUserAction = async (prevState, formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await dbConnect();

    const user = await users.findOne({ email: email.toLowerCase() });

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
