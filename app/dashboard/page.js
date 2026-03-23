import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MailDashboard from "@/components/MailDashboard";

export const metadata = { title: "MailDesk — Dashboard" };

export default function DashboardPage() {
  const cookieStore = cookies();
  const auth = cookieStore.get("maildesk-auth");

  if (!auth || auth.value !== "maildesk_authenticated") {
    redirect("/login");
  }

  return <MailDashboard />;
}