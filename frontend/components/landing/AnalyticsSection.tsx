"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export default function AnalyticsSection() {
  return (
    <section
      id="analytics"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
    >
      <div className="space-y-6 md:space-y-8">
        <p className="text-blue-600 text-xs font-bold tracking-widest uppercase">
          Advanced Tools
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          Detailed Analytics & <br />
          Financial Transparency
        </h2>

        <div className="space-y-6">
          {[
            {
              t: "Automated Billing Tracking",
              d: "Estimated monthly electricity bill based on real-time usage.",
            },
            {
              t: "Historical Usage Data",
              d: "Save and compare energy usage data from month to month.",
            },
            {
              t: "Energy Saving Tips",
              d: "Get optimization suggestions based on your electricity consumption patterns.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="mt-1 w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0">
                <ChevronRight size={14} />
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  {item.t}
                </h4>

                <p className="text-slate-500 text-sm mt-1">
                  {item.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-8">
        <div className="h-40 md:h-48 flex items-end gap-2 px-2">
          {[30, 60, 40, 80, 50, 70, 45].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 bg-blue-600/10 hover:bg-blue-600 rounded-t-md transition-all"
            ></div>
          ))}
        </div>

        <div className="bg-blue-600 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-lg">
          <span className="text-xs font-semibold">
           Check the full report for this week?
          </span>

          <button className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 transition">
            View Report
          </button>
        </div>
      </div>
    </section>
  );
}