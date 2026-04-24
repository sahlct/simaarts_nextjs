"use client";

import AboutHero from "@/components/aboutHero";
import NewArrivals from "@/components/newArrivals";
import WhyChooseUs from "@/components/whyChooseUs";
import React from "react";

export default function AboutPage() {
  return (
    <div className="py-10">
      <AboutHero />
      <WhyChooseUs />
      <NewArrivals />
    </div>
  );
}
