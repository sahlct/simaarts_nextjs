"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { IconMessage } from "@tabler/icons-react";
import { gsap } from "gsap";

import { CompanyProfileProvider } from "@/context/CompanyProfileContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompanyProfileProvider>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* PAGE CONTENT */}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppWidget />
      </div>
    </CompanyProfileProvider>
  );
}
