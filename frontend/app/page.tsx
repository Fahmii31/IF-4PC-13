"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import AnalyticsSection from "@/components/landing/AnalyticsSection";
import AboutSection from "@/components/landing/AboutSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <AnalyticsSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}