import { Metadata } from "next";

export const sharedMetadata: Metadata = {
  title: "ELBANO | Premier Roofing Solutions in Kerala - India",
  description: "Protect and beautify your home with Kerala's trusted choice for premium roofing materials. From elegant roofing tiles and heavy-duty shingles to reliable rain gutters, we deliver lasting durability tailored to your style.",
  keywords: ["Roofing Solutions", "Roofing Tiles", "Rain Gutters", "Premium Shingles", "ELBANO", "Kerala Roofing", "Roofing Materials India", "Ceramic Tiles"],
  authors: [{ name: "ELBANO" }],
  metadataBase: new URL("https://elbanoindia.com"),
  alternates: {
    canonical: "https://elbanoindia.com",
  },
  openGraph: {
    title: "ELBANO | Premier Roofing Solutions in Kerala - India",
    description: "Protect and beautify your home with Kerala's trusted choice for premium roofing materials. From elegant roofing tiles and heavy-duty shingles to reliable rain gutters, we deliver lasting durability tailored to your style.",
    url: "https://elbanoindia.com",
    siteName: "ELBANO",
    images: [
      {
        url: "https://elbanoindia.com/elbano_logo.png",
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
    title: "ELBANO | Premier Roofing Solutions in Kerala - India",
    description: "Protect and beautify your home with Kerala's trusted choice for premium roofing materials. From elegant roofing tiles and heavy-duty shingles to reliable rain gutters, we deliver lasting durability tailored to your style.",
    images: ["https://elbanoindia.com/elbano_logo.png"],
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
