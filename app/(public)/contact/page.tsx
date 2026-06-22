import ContactClient from "@/components/ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a question about our collections or a custom project? Get in touch with ELBANO's tile specialists for expert guidance and personalized consultation. Visit us at Airport Road, Karuvankallu, Malappuram.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | ELBANO",
    description: "Get in touch with ELBANO's tile specialists for expert guidance and personalized consultation in Kerala.",
    url: "https://elbanoindia.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
