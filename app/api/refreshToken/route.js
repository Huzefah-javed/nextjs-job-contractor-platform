import { NextResponse } from "next/server";
import { fetchAuthData } from "@/helpers/authTokenReActive";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    const res = await fetchAuthData(userId);
    if (!res) throw new Error("user detail not found");
    return NextResponse.json({ success: true, data: res });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
