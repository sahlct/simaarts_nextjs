import ContactClient from "@/components/ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Elbano",
  description: "Have a question about our collections or a custom project? Get in touch with our tile specialists for expert guidance and personalized consultation.",
};

export default function ContactPage() {
  return <ContactClient />;
}
