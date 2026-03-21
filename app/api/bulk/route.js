import { NextResponse } from "next/server";
import { sendBulkEmail } from "@/lib/zeptomail";
import { insertEmail } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { recipients, subject, message } = body;

    if (!recipients?.length || !subject || !message) {
      return NextResponse.json({ error: "Missing fields: recipients, subject, message" }, { status: 400 });
    }
    if (recipients.length > 100) {
      return NextResponse.json({ error: "Max 100 recipients per send" }, { status: 400 });
    }

    const htmlBody = `<div style="font-family:sans-serif;font-size:15px;color:#374151;line-height:1.7">
      ${message.split("\n").map((p) => `<p>${p}</p>`).join("")}
    </div>`;

    const results = await sendBulkEmail(recipients, subject, htmlBody, message);
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed    = results.filter((r) => r.status === "rejected").length;

    // Save each successful send to the DB
    const saves = results
      .filter((r) => r.status === "fulfilled")
      .map((_, i) =>
        insertEmail({
          type: "outbound",
          fromEmail: process.env.ZEPTO_FROM_EMAIL,
          fromName: process.env.ZEPTO_FROM_NAME,
          toEmail: recipients[i].to,
          toName: recipients[i].toName || recipients[i].to,
          subject,
          body: message,
          tag: "Bulk",
          unread: false,
        })
      );
    await Promise.allSettled(saves);

    return NextResponse.json({ success: true, succeeded, failed, results });
  } catch (error) {
    console.error("Bulk send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
