import AboutClient from "@/components/AboutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | elbano",
  description: "Learn about Elbano's legacy of importing the world's finest ceramic tiles since 1995. Discover our vision, mission, and the people behind our success.",
};

export default function AboutPage() {
  return <AboutClient />;
}
