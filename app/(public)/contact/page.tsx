import ContactClient from "@/components/ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SimaArts",
  description: "Get in touch with SimaArts for Scout & Guide badge custom embroidery, troop uniform bulk orders, and product inquiries.",
};

export default function ContactPage() {
  return <ContactClient />;
}
