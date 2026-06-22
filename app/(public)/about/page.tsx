import AboutClient from "@/components/AboutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Welcome to Elbano Roofings, where we turn houses into lasting landmarks. True to our branding tagline, Built to strong, made to last, we provide premium, weather-resistant roofing and building solutions across Kerala.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | ELBANO",
    description: "Welcome to Elbano Roofings — Built to strong, made to last. Premium, weather-resistant roofing and building solutions across Kerala.",
    url: "https://elbanoindia.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
