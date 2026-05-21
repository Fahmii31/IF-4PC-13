// components/landing/Footer.tsx
"use client";

import React from "react";
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  ChevronRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-100 bg-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-100">

          {/* BRAND */}
          <div className="space-y-5">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Zap size={18} fill="currentColor" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  VoltCore
                </h3>

                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
                  Power Intelligence
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-7 max-w-sm">
              Smart household energy monitoring platform designed to deliver
              real-time electrical insights, efficiency, and control.
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="space-y-5">

            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              Navigation
            </h4>

            <div className="space-y-3">

              {[
                "Features",
                "Analytics",
                "About Us",
                "Dashboard"
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition group"
                >
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition"
                  />

                  {item}
                </a>
              ))}

            </div>
          </div>

          {/* FEATURES */}
          <div className="space-y-5">

            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              Features
            </h4>

            <div className="space-y-3 text-sm text-slate-500">

              <p>Real-time Monitoring</p>
              <p>Remote Power Control</p>
              <p>WhatsApp Notification</p>
              <p>Energy Analytics</p>

            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-5">

            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              Contact
            </h4>

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <Mail
                  size={16}
                  className="text-blue-600 mt-0.5"
                />

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Email
                  </p>

                  <p className="text-sm text-slate-600">
                    voltcore@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={16}
                  className="text-blue-600 mt-0.5"
                />

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Phone
                  </p>

                  <p className="text-sm text-slate-600">
                    +62 812-3456-7890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-blue-600 mt-0.5"
                />

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Location
                  </p>

                  <p className="text-sm text-slate-600">
                    Batam, Indonesia
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-xs text-slate-400 tracking-wide text-center md:text-left">
            © 2026 VoltCore Intelligence. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">

            <a
              href="#"
              className="hover:text-blue-600 transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-blue-600 transition"
            >
              Terms
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}