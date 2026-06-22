import AboutClient from "@/components/AboutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | elbano",
  description: "Welcome to Elbano Roofings, where we turn houses into lasting landmarks.True to our branding tagline, Built to strong, made to last, we provide premium, weather-resistant roofing and building solutions",
};

export default function AboutPage() {
  return <AboutClient />;
}
