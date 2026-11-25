import { NextResponse } from "next/server";
import { authenticatingUser, fetchAuthData } from "@/helpers/authTokenReActive";

export async function POST(request) {
  try {
    const { userId, sessionId } = await request.json();
    const sessionResponse = await authenticatingUser(sessionId, userId);
    if (!sessionResponse) throw new Error("user session not found");
    const res = await fetchAuthData(userId);
    if (!res) throw new Error("user detail not found");
    return NextResponse.json({ success: true, data: res });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
