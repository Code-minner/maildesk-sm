import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/zeptomail";
import { insertEmail } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, toName, subject, message, replyTo } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing fields: to, subject, message" }, { status: 400 });
    }

    const htmlBody = `<div style="font-family:sans-serif;font-size:15px;color:#374151;line-height:1.7">
      ${message.split("\n").map((p) => `<p>${p}</p>`).join("")}
    </div>`;

    // ── Save to DB first — always ────────────────────────────────────────────
    const saved = await insertEmail({
      type: "outbound",
      fromEmail: process.env.ZEPTO_FROM_EMAIL,
      fromName: process.env.ZEPTO_FROM_NAME,
      toEmail: to,
      toName: toName || to,
      subject,
      body: message,
      tag: "Sent",
      unread: false,
    });

    // ── Try to send ──────────────────────────────────────────────────────────
    let sendWarning = null;
    try {
      await sendEmail({ to, toName, subject, htmlBody, replyTo });
    } catch (sendErr) {
      console.error("Send error (saved to DB):", sendErr.message);
      sendWarning = sendErr.message;
    }

    return NextResponse.json({
      success: true,
      id: saved._id?.toString(),
      warning: sendWarning,
    });
  } catch (error) {
    console.error("Send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}