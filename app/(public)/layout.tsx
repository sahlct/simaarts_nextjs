"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { IconMessage } from "@tabler/icons-react";
import { gsap } from "gsap";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* PAGE CONTENT */}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
