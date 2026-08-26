"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const authAndGetUser = async () => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("authCookie")?.value;
  const sessionCookie = cookieStore.get("sessionCookie")?.value;

  if (authCookie) {
    const token = jwt.verify(authCookie, process.env.JWT_SECRET);
    if (!token) return { success: false };
    return { success: true, ...token };
  }

  if (sessionCookie) {
    try {
      const value = jwt.verify(sessionCookie, process.env.JWT_SECRET);
      if (!value) return redirect("/login");

      const response = await fetch(`/api/refreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: value.userId }),
      });

      if (!response.ok) {
        return { success: false };
      }

      const data = await response.json();

      const token = jwt.sign(data.data, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      cookieStore.set("authCookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
      return { success: true, ...token };
    } catch (err) {
      return { success: false };
    }
  }

  return redirect("/login");
};
