# MailDesk — Professional Mailing System
### Built with Next.js 14 + Zepto Mail

---

## Quick Start (3 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Zepto Mail credentials
Open `.env.local` and fill in:
```
ZEPTO_API_KEY=Zoho-enczapikey YOUR_KEY_HERE
ZEPTO_FROM_EMAIL=support@yourbusiness.com
ZEPTO_FROM_NAME=YourBusiness Support
NEXT_PUBLIC_BUSINESS_NAME=YourBusiness
```

**How to get your API key:**
1. Log into https://zeptomail.zoho.com
2. Go to Settings → API Tokens → Generate Token
3. Go to Settings → Sender Addresses → Add & verify your email

### 3. Run the app
```bash
npm run dev
```
Open http://localhost:3000 — you'll see the dashboard.

---

## Features

| Feature | Description |
|---|---|
| 📥 Inbox | View all incoming customer emails |
| ✏️ Compose | Send a new email to any customer |
| 📤 Sent | View all emails you've sent |
| 💬 Reply | Reply directly to customer emails |
| 📢 Bulk Send | Send one email to many customers at once |
| 🔔 Unread badge | See how many unread messages you have |

---

## Project Structure

```
maildesk/
├── app/
│   ├── api/
│   │   ├── emails/
│   │   │   ├── route.js              ← GET all emails (inbox/sent)
│   │   │   └── [id]/route.js         ← PATCH mark as read
│   │   ├── send/route.js             ← POST send new email
│   │   ├── reply/route.js            ← POST reply to customer
│   │   ├── bulk/route.js             ← POST bulk send
│   │   └── webhook/inbound/route.js  ← Receive customer replies
│   ├── dashboard/page.js             ← Main dashboard page
│   ├── layout.js
│   ├── page.js                       ← Redirects to /dashboard
│   └── globals.css
├── components/
│   ├── MailDashboard.jsx             ← Full dashboard UI
│   └── MailDashboard.module.css      ← All styles
├── lib/
│   ├── zeptomail.js                  ← Zepto Mail API client
│   ├── templates.js                  ← HTML email templates
│   └── store.js                      ← In-memory email store (swap for DB)
├── .env.local                        ← Your credentials (fill this in!)
└── package.json
```

---

## Receiving Customer Replies (Inbound)

When a customer hits "Reply" in their email app, you can receive it in your dashboard:

1. In Zepto Mail → **Settings → Inbound Email**
2. Add an inbound domain (e.g. `reply.yourdomain.com`)
3. Add the **MX record** Zepto Mail gives you to your domain DNS
4. Set **Webhook URL** to: `https://yourdomain.com/api/webhook/inbound`
5. Customer replies now appear automatically in your Inbox

> For local testing, use [ngrok](https://ngrok.com): `ngrok http 3000` and use the ngrok URL as your webhook.

---

## Adding a Real Database

The app currently uses an in-memory store (`lib/store.js`). To persist emails:

### Option A: Supabase (free, recommended)
```bash
npm install @supabase/supabase-js
```
Create a `emails` table in Supabase, then replace `emailStore` calls in your API routes with Supabase queries.

### Option B: MongoDB Atlas (free)
```bash
npm install mongodb
```
Connect via `MONGODB_URI` env variable and insert/query the `emails` collection.

---

## Deploying to Production

```bash
# Build
npm run build

# Deploy to Vercel (easiest)
npx vercel
```
Add your `.env.local` variables to Vercel's Environment Variables in the project settings.

---

## Email Templates Available

In `lib/templates.js`:
- `supportReplyTemplate()` — Professional support reply with ticket ID
- `orderConfirmationTemplate()` — Order receipt with item table
- `welcomeTemplate()` — Onboarding email with CTA button
- `plainTemplate()` — Simple custom message

Use them in any API route:
```js
import { supportReplyTemplate } from "@/lib/templates";
const html = supportReplyTemplate({ customerName: "Amaka", agentName: "Tunde", ... });
```
