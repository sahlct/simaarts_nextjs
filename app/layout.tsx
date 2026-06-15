import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { Nunito_Sans } from "next/font/google";
import DisableRightClick from "@/components/DisableRightClick";

import { sharedMetadata } from "@/lib/metadata";

export const metadata = sharedMetadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: [
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "1000",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`
        ${nunito.variable}
        ${GeistSans.variable}
        ${GeistMono.variable}
      `}
    >
      <body className="font-nunito">
        <ToastProvider>{children}</ToastProvider>
        <DisableRightClick />
        <Analytics />
      </body>
    </html>
  );
}
