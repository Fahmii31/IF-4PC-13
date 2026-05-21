// components/landing/HeroSection.tsx
"use client";

import Image from "next/image";

export default function HeroSection() {

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);

    element?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

      {/* LEFT CONTENT */}
      <div className="space-y-6 text-center lg:text-left">

        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold uppercase tracking-wider">
          IoT Energy Monitoring
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
          Master Your <br />
          <span className="text-blue-600">
            Energy Consumption
          </span>
        </h1>

        <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
          Monitor the electrical current in your home installation in real-time with high accuracy using IoT technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">

          <button
            onClick={() => scrollTo("features")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            Get Started
          </button>

          <button className="bg-slate-50 text-slate-600 px-8 py-3 rounded-lg font-bold text-sm border border-slate-100 hover:bg-slate-100 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative flex justify-center lg:justify-end">

        <div className="relative w-full max-w-xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">

          <Image
            src="/Landing-Hero.jpg"
            alt="VoltCore Hero"
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-blue-900/20"></div>

          {/* Glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
}