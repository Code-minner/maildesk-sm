import { NextResponse } from "next/server";
import { clearAllEmails } from "@/lib/db";

export async function DELETE() {
  try {
    await clearAllEmails();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}