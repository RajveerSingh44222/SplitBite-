import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "PartyPlatter \u2014 Collaborative Food Ordering for Every Gathering",
  description:
    "Host creates the event, everyone orders their own food, one click places it all. PartyPlatter is the easiest way to order food for groups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
