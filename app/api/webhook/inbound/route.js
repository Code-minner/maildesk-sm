import { NextResponse } from "next/server";
import { insertEmail } from "@/lib/db";

/**
 * Zepto Mail Inbound Webhook
 * Set this URL in: Zepto Mail → Settings → Inbound Email → Webhook URL
 * URL: https://yourdomain.com/api/webhook/inbound
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Auto-detect tag from subject keywords
    const subject = (body.subject || "").toLowerCase();
    let tag = "Inbound";
    if (subject.includes("order") || subject.includes("delivery")) tag = "Order";
    else if (subject.includes("payment") || subject.includes("invoice")) tag = "Payment";
    else if (subject.includes("refund")) tag = "Refund";
    else if (subject.includes("account") || subject.includes("verify")) tag = "Account";
    else if (subject.includes("bulk") || subject.includes("quote")) tag = "Sales";

    await insertEmail({
      type: "inbound",
      fromEmail: body.from?.[0]?.email || "",
      fromName:  body.from?.[0]?.name  || "",
      toEmail:   body.to?.[0]?.email   || "",
      subject:   body.subject           || "(No subject)",
      body:      body.text || body.html?.replace(/<[^>]*>/g, "") || "",
      tag,
      unread: true,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Inbound webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
