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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://elbanoindia.com/#website",
        "url": "https://elbanoindia.com",
        "name": "ELBANO",
        "description": "Protect and beautify your home with Kerala's trusted choice for premium roofing materials. From elegant roofing tiles and heavy-duty shingles to reliable rain gutters, we deliver lasting durability tailored to your style.",
        "publisher": {
          "@id": "https://elbanoindia.com/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://elbanoindia.com/#organization",
        "name": "ELBANO",
        "url": "https://elbanoindia.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://elbanoindia.com/elbano_logo.png"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9995616166",
          "contactType": "customer service"
        }
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://elbanoindia.com/#navigation",
        "name": [
          "Home",
          "Products",
          "Projects",
          "About Us",
          "Contact Us"
        ],
        "url": [
          "https://elbanoindia.com/",
          "https://elbanoindia.com/products",
          "https://elbanoindia.com/projects",
          "https://elbanoindia.com/about",
          "https://elbanoindia.com/contact"
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
