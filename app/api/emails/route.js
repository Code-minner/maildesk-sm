import { NextResponse } from "next/server";
import { getAllEmails, getUnreadCount } from "@/lib/db";

export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "inbound" | "outbound" | null

    const emails = await getAllEmails(type);
    const unreadCount = await getUnreadCount();

    // Serialize MongoDB _id to string so it's JSON-safe
    const serialized = emails.map((e) => ({
      ...e,
      id: e._id.toString(),
      _id: undefined,
      createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
    }));

    return NextResponse.json({ emails: serialized, unreadCount });
  } catch (error) {
    console.error("GET /api/emails error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}