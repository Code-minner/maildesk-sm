import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.ZEPTOMAIL_HOST,
    port: Number(process.env.ZEPTOMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.ZEPTOMAIL_USER,
      pass: process.env.ZEPTOMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    dnsTimeout: 10000,
    socketTimeout: 10000,
    logger: false,
    transactionLog: false,
    // Force IPv4 — fixes EAI_AGAIN / ESERVFAIL DNS errors on some systems
    resolve: (host, callback) => {
      require("dns").resolve4(host, (err, addresses) => {
        if (err) return callback(err);
        callback(null, addresses.map((a) => ({ address: a, family: 4 })));
      });
    },
  });
}

export async function sendEmail({ to, toName, subject, htmlBody, textBody, replyTo }) {
  const transporter = createTransporter();

  // Zepto Mail requires the FROM to exactly match a verified sender address
  const fromEmail = process.env.ZEPTO_FROM_EMAIL;
  const fromName = process.env.ZEPTO_FROM_NAME;

  const mailOptions = {
    from: { name: fromName, address: fromEmail }, // structured object avoids formatting issues
    to: toName ? { name: toName, address: to } : to,
    subject,
    html: htmlBody,
    text: textBody || stripHtml(htmlBody),
    ...(replyTo && { replyTo }),
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, accepted: info.accepted };
}

export async function sendBulkEmail(recipients, subject, htmlBody, textBody) {
  const results = await Promise.allSettled(
    recipients.map((r) =>
      sendEmail({ to: r.to, toName: r.toName, subject, htmlBody, textBody })
    )
  );

  return results.map((r, i) => ({
    recipient: recipients[i].to,
    status: r.status,
    error: r.reason?.message || null,
  }));
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}