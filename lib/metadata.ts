import { Metadata } from "next";

export const sharedMetadata: Metadata = {
  title: "ELBANO | Premium Ceramic Tiles",
  description: "ELBANO offers a wide range of premium quality doors, shutters, and interior solutions. Experience the perfect blend of elegance and durability.",
  keywords: ["Doors", "Interior Solutions", "ELBANO", "Modern Doors", "Home Decor", "Premium Shutters"],
  authors: [{ name: "ELBANO" }],
  metadataBase: new URL("https://ssemlp.com"),
  alternates: {
    canonical: "https://ssemlp.com",
  },
  openGraph: {
    title: "ELBANO | Premium Doors & Interiors",
    description: "Discover our premium collection of doors and interior solutions crafted for modern living. Elegance meets durability at SS Enterprises.",
    url: "https://ssemlp.com",
    siteName: "SS Enterprises",
    images: [
      {
        url: "https://ssemlp.com/elbano_logo.jpeg",
        width: 1200,
        height: 630,
        alt: "SS Enterprises Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SS ENTERPRISES | Premium Doors & Interiors",
    description: "Discover our premium collection of doors and interior solutions crafted for modern living.",
    images: ["https://ssemlp.com/elbano_logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/favicon-16x16.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
    ],
  },
  manifest: "/site.webmanifest",
};
