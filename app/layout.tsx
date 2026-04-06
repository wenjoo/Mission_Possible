import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const font = Nunito({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Definitely not a surprise",
  description: "A playful last-day sendoff. Tap responsibly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff7ef",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
