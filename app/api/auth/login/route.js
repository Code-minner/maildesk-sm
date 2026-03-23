import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();
  const correct = process.env.MAILDESK_PASSWORD;

  if (!correct) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  if (password !== correct) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

  const response = NextResponse.json({ success: true });
  response.cookies.set("maildesk_auth", process.env.MAILDESK_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}