import AboutClient from "@/components/AboutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | SimaArts",
  description: "Learn about SimaArts, India's trusted manufacturer of official Scout & Guide embroidered badges, certified uniforms, and troop supplies.",
};

export default function AboutPage() {
  return <AboutClient />;
}
