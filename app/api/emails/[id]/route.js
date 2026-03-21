import { NextResponse } from "next/server";
import { markEmailRead, deleteEmail } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    await markEmailRead(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await deleteEmail(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}