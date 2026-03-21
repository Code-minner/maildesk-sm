import "./globals.css";

export const metadata = {
  title: "MailDesk — Business Mailing System",
  description: "Professional email management powered by Zepto Mail",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
