import { Metadata } from "next";

export const sharedMetadata: Metadata = {
  title: "ELBANO | Premium Ceramic Tiles & Roofing Solutions",
  description: "ELBANO offers a wide range of premium quality imported ceramic tiles and roofing solutions. Experience the perfect blend of elegance and durability.",
  keywords: ["Ceramic Tiles", "Roofing Solutions", "ELBANO", "Roofing Sheets", "Home Decor", "Premium Tiles"],
  authors: [{ name: "ELBANO" }],
  metadataBase: new URL("https://elbano.com"),
  alternates: {
    canonical: "https://elbano.com",
  },
  openGraph: {
    title: "ELBANO | Premium Ceramic Tiles & Roofing Solutions",
    description: "Discover our premium collection of imported ceramic tiles and roofing solutions crafted for modern living. Elegance meets durability at ELBANO.",
    url: "https://elbano.com",
    siteName: "ELBANO",
    images: [
      {
        url: "https://elbano.com/elbano_logo.png",
        width: 1200,
        height: 630,
        alt: "ELBANO Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELBANO | Premium Ceramic Tiles & Roofing Solutions",
    description: "Discover our premium collection of imported ceramic tiles and roofing solutions crafted for modern living.",
    images: ["https://elbano.com/elbano_logo.png"],
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
