import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { Nunito } from "next/font/google";
import DisableRightClick from "@/components/DisableRightClick";

import { sharedMetadata } from "@/lib/metadata";

export const metadata = sharedMetadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://simaarts.in/#website",
        "url": "https://simaarts.in",
        "name": "SimaArts",
        "description": "Official manufacturer and supplier of Scout & Guide embroidered badges, certified uniforms, scarves, caps, belts, and insignia.",
        "publisher": {
          "@id": "https://simaarts.in/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://simaarts.in/#organization",
        "name": "SimaArts",
        "url": "https://simaarts.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://simaarts.in/logo.png"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9995616166",
          "contactType": "customer service"
        }
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://simaarts.in/#navigation",
        "name": [
          "Home",
          "Products",
          "About Us",
          "Contact Us"
        ],
        "url": [
          "https://simaarts.in/",
          "https://simaarts.in/products",
          "https://simaarts.in/about",
          "https://simaarts.in/contact"
        ]
      }
    ]
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>{children}</ToastProvider>
        <DisableRightClick />
        <Analytics />
      </body>
    </html>
  );
}
