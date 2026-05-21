// components/landing/AboutSection.tsx
"use client";

import React from "react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about-us"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F7FB]"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* IMAGE */}
        <div className="relative">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl bg-black">

            <Image
              src="/Landing-About.jpg"
              alt="About VoltCore"
              fill
              priority
              className="object-cover"
            />

          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-10">

          {/* TITLE */}
          <div className="space-y-5">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-[0.25em] uppercase">
              Our Identity
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Empowering Homes
              <br />
              Through{" "}
              <span className="text-blue-600">
                Intelligence
              </span>
            </h2>
          </div>

          {/* DEFINITION */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-600">
              Definition
            </p>

            <h3 className="text-2xl font-bold text-slate-900">
              What is VoltCore?
            </h3>

            <p className="text-slate-500 leading-8 text-base">
              VoltCore is a smart household energy monitoring platform engineered
              for the modern era. We bridge the gap between complex electrical
              data and actionable household insights.
            </p>
          </div>

          {/* OBJECTIVE */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-600">
              Objective
            </p>

            <h3 className="text-2xl font-bold text-slate-900">
              Our Goal
            </h3>

            <p className="text-slate-500 leading-8 text-base">
              To provide absolute precision and total transparency in energy
              consumption. We aim to eliminate the utility bill anxiety by
              putting real-time data and remote control directly into the hands
              of homeowners.
            </p>
          </div>

          {/* HISTORY */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-600">
              Brief History
            </p>

            <h3 className="text-2xl font-bold text-slate-900">
              Background
            </h3>

            <p className="text-slate-500 leading-8 text-base">
              VoltCore was born from a simple yet urgent need: to address rising
              energy costs through intelligent technology. Starting as a
              laboratory project to optimize domestic power grids, we have
              evolved into a sophisticated ecosystem used by thousands to drive
              sustainability and savings.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}