import { Metadata } from "next";

const siteUrl = "https://simaarts.in";
const siteName = "SimaArts";
const siteTitle = "SimaArts | Scout & Guide Badges, Uniforms & Accessories";
const siteDescription =
  "Official manufacturer and supplier of Scout & Guide embroidered badges, certified uniforms, scarves, woggles, caps, belts, and insignia in India.";

export const sharedMetadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | SimaArts - Scout & Guide Badges & Uniforms",
  },
  description: siteDescription,
  keywords: [
    "Scout Badges",
    "Guide Badges",
    "Scout Uniforms",
    "Guide Uniforms",
    "SimaArts",
    "Embroidered Badges",
    "Scout Scarves",
    "Scout Accessories",
    "Bharat Scouts and Guides Badges",
    "Troop Supplies",
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
          alt: "SimaArts - Scout & Guide Badges & Uniforms",
          type: "image/png",
        },
        {
          url: `${siteUrl}/logo.png`,
          width: 512,
          height: 512,
          alt: "SimaArts Logo",
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
      creator: "@simaarts",
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
