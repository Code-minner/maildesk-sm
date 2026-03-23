import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correct = process.env.DASHBOARD_PASSWORD;

    if (!correct) {
      return NextResponse.json({ error: "DASHBOARD_PASSWORD not set in environment" }, { status: 500 });
    }

    if (!password || password.trim() !== correct.trim()) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "maildesk-auth",
      value: "maildesk_authenticated",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("maildesk-auth");
  return response;
}