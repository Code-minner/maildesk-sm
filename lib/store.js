// In-memory store — swap this out with Supabase/MongoDB/Prisma later
// Just import { emailStore } from "@/lib/store" anywhere you need it

export const emailStore = {
  emails: [
    {
      id: "1",
      type: "inbound",
      fromName: "Amaka Obi",
      fromEmail: "amaka@techstartup.ng",
      toEmail: "support@yourbusiness.com",
      subject: "Re: Order #1042 — Delivery Update",
      body: "Hi Support Team,\n\nThanks for the quick response! I was wondering if the delivery would arrive before end of week. We have a product launch on Friday and really need the items by then.\n\nCould you please check with logistics and confirm?\n\nBest,\nAmaka",
      tag: "Order",
      unread: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      type: "inbound",
      fromName: "Chidi Nwosu",
      fromEmail: "chidi@company.com",
      toEmail: "support@yourbusiness.com",
      subject: "Payment issue on invoice #557",
      body: "Hello,\n\nI've tried paying twice now and it keeps declining at checkout. I've verified my card details are correct and my bank says there's no block on the card.\n\nPlease help resolve this urgently.\n\nRegards,\nChidi Nwosu",
      tag: "Payment",
      unread: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "3",
      type: "inbound",
      fromName: "Fatima Bello",
      fromEmail: "fatima.b@gmail.com",
      toEmail: "support@yourbusiness.com",
      subject: "Account verification pending",
      body: "Good morning,\n\nI registered on your platform 3 days ago but my account still shows as pending verification. I've checked my email and haven't received any verification link.\n\nPlease help activate my account.\n\nThank you,\nFatima",
      tag: "Account",
      unread: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "4",
      type: "inbound",
      fromName: "Emeka Eze",
      fromEmail: "emeka@buydirect.ng",
      toEmail: "support@yourbusiness.com",
      subject: "Bulk order inquiry — 500 units",
      body: "Hello Sales Team,\n\nWe are interested in placing a bulk order of 500 units of your product SKU-204. Could you please provide a quote with bulk pricing and estimated delivery timelines?\n\nBest regards,\nEmeka Eze\nBuyDirect NG",
      tag: "Sales",
      unread: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "5",
      type: "outbound",
      fromName: "Support Team",
      fromEmail: "support@yourbusiness.com",
      toEmail: "ngozi.a@outlook.com",
      toName: "Ngozi Adeyemi",
      subject: "Re: Refund request — ref #8821",
      body: "Hi Ngozi,\n\nWe have processed your refund of ₦15,000 for order #8821. Please allow 3-5 business days for it to reflect in your account.\n\nSorry for the inconvenience.\n\nBest regards,\nSupport Team",
      tag: "Refund",
      unread: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],

  getAll() {
    return [...this.emails].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getInbox() {
    return this.getAll().filter((e) => e.type === "inbound");
  },

  getSent() {
    return this.getAll().filter((e) => e.type === "outbound");
  },

  getById(id) {
    return this.emails.find((e) => e.id === id);
  },

  markRead(id) {
    const email = this.getById(id);
    if (email) email.unread = false;
  },

  add(email) {
    this.emails.unshift({ ...email, id: Date.now().toString(), createdAt: new Date().toISOString() });
  },

  unreadCount() {
    return this.emails.filter((e) => e.type === "inbound" && e.unread).length;
  },
};
