"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
      <div className="max-w-7xl mx-auto bg-blue-600 rounded-[2rem] py-14 md:py-20 px-6 md:px-8 text-center text-white shadow-2xl shadow-blue-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to optimize your home?
        </h2>

        <p className="text-blue-100 mb-10 max-w-md mx-auto text-sm md:text-base">
          Start monitoring your electricity usage with a smarter system now.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="bg-white text-blue-600 px-8 md:px-10 py-4 rounded-xl font-bold text-sm shadow-xl hover:bg-blue-50 transition"
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
}