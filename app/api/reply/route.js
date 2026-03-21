import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/zeptomail";
import { supportReplyTemplate } from "@/lib/templates";
import { insertEmail } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, toName, subject, message, agentName, ticketId } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing fields: to, subject, message" }, { status: 400 });
    }

    const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;

    const htmlBody = supportReplyTemplate({
      customerName: toName || to,
      agentName: agentName || process.env.ZEPTO_FROM_NAME,
      businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Support Team",
      message,
      ticketId,
    });

    // ── Save to DB first — always, even if email send fails ──────────────────
    const saved = await insertEmail({
      type: "outbound",
      fromEmail: process.env.ZEPTO_FROM_EMAIL,
      fromName: agentName || process.env.ZEPTO_FROM_NAME,
      toEmail: to,
      toName: toName || to,
      subject: replySubject,
      body: message,
      tag: "Reply",
      unread: false,
    });

    // ── Now try to send — report warning if it fails but don't error ─────────
    let sendWarning = null;
    try {
      await sendEmail({ to, toName, subject: replySubject, htmlBody });
    } catch (sendErr) {
      console.error("Reply send error (saved to DB):", sendErr.message);
      sendWarning = sendErr.message;
    }

    return NextResponse.json({
      success: true,
      id: saved._id?.toString(),
      warning: sendWarning, // frontend can show this if needed
    });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}