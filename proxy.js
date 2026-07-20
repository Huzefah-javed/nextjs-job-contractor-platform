import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  const origin = request.nextUrl.origin;
  const path = request.nextUrl.pathname;
  const authCookie = request.cookies.get("authCookie")?.value;
  const sessionCookie = request.cookies.get("sessionCookie")?.value;

  if (authCookie) {
    try {
      const token = jwt.verify(authCookie, process.env.JWT_SECRET);
      if (!token) return NextResponse.redirect(new URL("/", request.url));
      if (path.slice(1, token.role.length + 1) !== token.role)
        return NextResponse.redirect(new URL("/", request.url));
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (sessionCookie) {
    try {
      const value = jwt.verify(sessionCookie, process.env.JWT_SECRET);
      if (!value) return NextResponse.redirect(new URL("/", request.url));

      const response = await fetch(`${origin}/api/refreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: value.userId }),
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      const data = await response.json();

      if (path.slice(1, data.data.role.length + 1) !== data.data.role)
        return NextResponse.redirect(new URL("/", request.url));

      const res = NextResponse.next();

      const token = jwt.sign(data.data, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      res.cookies.set("authCookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
      return res;
    } catch (err) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/contractor/:path*"],
};
