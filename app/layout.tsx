import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yeled.ai MVP",
  description: "Jewish early years planning and parent insights"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
