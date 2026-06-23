import { Metadata } from "next";

const siteUrl = "https://elbanoindia.com";
const siteName = "ELBANO";
const siteTitle = "ELBANO | Premier Roofing Solutions in Kerala - India";
const siteDescription =
  "Protect and beautify your home with Kerala's trusted choice for premium roofing materials. From elegant roofing tiles and heavy-duty shingles to reliable rain gutters, we deliver lasting durability tailored to your style.";

export const sharedMetadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | ELBANO - Premier Roofing Solutions",
  },
  description: siteDescription,
  keywords: [
    "Roofing Solutions",
    "Roofing Tiles",
    "Rain Gutters",
    "Premium Shingles",
    "ELBANO",
    "Kerala Roofing",
    "Roofing Materials India",
    "Ceramic Tiles",
    "Roofing Tiles Kerala",
    "Premium Roofing",
    "Building Materials",
    "Elbano Roofings",
    "Elbano India",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ELBANO - Premier Roofing Solutions in Kerala, India",
        type: "image/png",
      },
      {
        url: `${siteUrl}/elbano_logo.png`,
        width: 512,
        height: 512,
        alt: "ELBANO Logo",
        type: "image/png",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@elbanoindia",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "construction",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};
