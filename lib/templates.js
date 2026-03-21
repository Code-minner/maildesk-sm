const BASE = `
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f0}
  .w{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e8e8e3}
  .h{background:#0f172a;padding:24px 32px}
  .h h1{color:#fff;font-size:20px;font-weight:500;margin:0}
  .b{padding:32px;color:#374151;font-size:15px;line-height:1.7}
  .f{padding:20px 32px;background:#f9f9f7;border-top:1px solid #e8e8e3;font-size:12px;color:#9ca3af}
  .btn{display:inline-block;background:#0f172a;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;margin:16px 0}
  table{width:100%;border-collapse:collapse}
  th{font-size:12px;color:#9ca3af;text-transform:uppercase;text-align:left;padding:0 0 8px}
`;

function wrap(title, body, footer) {
  return `<!DOCTYPE html><html><head><style>${BASE}</style></head><body>
  <div class="w">
    <div class="h"><h1>${title}</h1></div>
    <div class="b">${body}</div>
    <div class="f">${footer}</div>
  </div></body></html>`;
}

export function supportReplyTemplate({ customerName, agentName, businessName, message, ticketId }) {
  return wrap(
    `${businessName} — Support`,
    `<p>Hi ${customerName},</p>
     <p>${message.replace(/\n/g, "<br/>")}</p>
     <p>If you need anything else, just reply to this email.</p>
     <p>Best regards,<br/><strong>${agentName}</strong><br/>${businessName} Support</p>
     ${ticketId ? `<p style="font-size:12px;color:#9ca3af">Ticket: #${ticketId}</p>` : ""}`,
    `You're receiving this because you contacted ${businessName} support. Reply to continue the conversation.`
  );
}

export function orderConfirmationTemplate({ customerName, orderId, items, total, businessName, supportEmail }) {
  const rows = items
    .map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0ee">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0ee;text-align:center">${i.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0ee;text-align:right">₦${i.price.toLocaleString()}</td></tr>`)
    .join("");
  return wrap(
    `Order Confirmed — #${orderId}`,
    `<p>Hi ${customerName}, your order is confirmed!</p>
     <table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th></tr></thead>
     <tbody>${rows}</tbody>
     <tfoot><tr><td colspan="2" style="padding-top:12px;font-weight:600">Total</td>
     <td style="padding-top:12px;font-weight:600;text-align:right">₦${total.toLocaleString()}</td></tr></tfoot></table>
     <p style="margin-top:24px">Questions? Email <a href="mailto:${supportEmail}">${supportEmail}</a></p>`,
    `${businessName} · Reply for support`
  );
}

export function welcomeTemplate({ customerName, businessName, ctaUrl, ctaText = "Get Started" }) {
  return wrap(
    `Welcome to ${businessName}!`,
    `<p>Hi ${customerName},</p>
     <p>We're glad to have you! Your account is ready.</p>
     <a href="${ctaUrl}" class="btn">${ctaText}</a>
     <p>Have questions? Just reply to this email — we're always here.</p>
     <p>Welcome aboard,<br/><strong>The ${businessName} Team</strong></p>`,
    `${businessName} · Sent because you created an account.`
  );
}

export function plainTemplate({ customerName, businessName, subject, message, agentName }) {
  return wrap(
    subject,
    `<p>Hi ${customerName},</p>${message.split("\n").map((p) => `<p>${p}</p>`).join("")}
     <p>Best regards,<br/><strong>${agentName || businessName}</strong></p>`,
    `${businessName} · Reply to this email to respond.`
  );
}
