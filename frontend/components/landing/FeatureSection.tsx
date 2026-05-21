// components/landing/FeatureSection.tsx
"use client";

import {
  Activity,
  Smartphone,
  Lock,
  Zap,
  BellRing
} from "lucide-react";

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Architected for Precision
          </h2>

          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            An intelligent monitoring system specifically designed for energy efficiency at a single household installation point.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">

          {/* COLUMN 1 */}
          <div className="space-y-8 flex flex-col">

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Activity size={22} />
              </div>

              <h3 className="font-bold text-lg mb-2">
                Live Monitoring
              </h3>

              <p className="text-slate-500 text-xs leading-relaxed mb-6">
               Monitor <strong>Energy (kWh)</strong> flow and estimated <strong>Cost (Rupiah)</strong> in real-time.
              </p>

              <div className="flex flex-wrap gap-2">
                {["Ampere", "Voltage", "Watt", "kWh", "IDR"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded border border-slate-100 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">

                <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm">
                  <BellRing size={20} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    WhatsApp Alerts
                  </h4>

                  <p className="text-[10px] text-slate-400">
                    Critical notifications via WA & Dashboard
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-8 flex flex-col">

            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl flex-1 relative overflow-hidden">

              <div className="relative z-10">

                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Smartphone size={22} />
                </div>

                <h3 className="text-xl font-bold mb-2">
                  Remote Switch
                </h3>

                <p className="text-blue-100 text-xs mb-8 opacity-90">
                  Full power control at your fingertips.
                </p>

                <div className="flex items-center gap-4">

                  <div className="w-14 h-7 bg-emerald-400 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-widest">
                    Status: ON
                  </span>

                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 opacity-10">
                <Zap size={150} />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <Lock size={18} />
                </div>

                <h4 className="text-sm font-bold text-slate-800">
                  VA Selection (Settings)
                </h4>

              </div>

              <div className="grid grid-cols-2 gap-2">
                {[450, 900, 1300, 2200].map((va) => (
                  <div
                    key={va}
                    className={`text-[10px] font-bold p-2 rounded-lg border text-center transition-all ${
                      va === 1300
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-slate-100 text-slate-400"
                    }`}
                  >
                    {va} VA
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="space-y-8 flex flex-col">

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex-1">

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                Monthly History
              </p>

              <div className="h-24 flex items-end gap-1.5 mb-6">
                {[40, 70, 45, 90, 60, 80, 50, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-t-sm transition-all ${
                      i === 3
                        ? "bg-blue-600"
                        : "bg-slate-100 hover:bg-blue-200"
                    }`}
                  ></div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Cost Today
                  </p>

                  <p className="text-sm font-bold text-emerald-600">
                    Rp 174.250
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Usage
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    120.5 kWh
                  </p>
                </div>

              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Export to Excel
                  </h4>

                  <p className="text-[10px] text-slate-400">
                    Download .xlsx report
                  </p>
                </div>

                <div className="text-emerald-500 font-black text-xs">
                  XLSX
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}