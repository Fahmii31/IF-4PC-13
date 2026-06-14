"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  DollarSign,
  Activity,
  Calendar,
  Filter,
  AlertTriangle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Komponen
import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";

// Tipe Data
type KPIData = {
  accumulated_energy: number;
  total_cost: number;
  avg_base_load: number;
};

type ChartItem = {
  label: string;
  total_kwh: number;
  avg_power: number;
};

type TableItem = {
  label: string;
  total_kwh: number;
  avg_current: number;
  avg_voltage: number;
  avg_power: number;
  total_cost: number;
};

export default function HistoryAnalyticsPage() {
  const router = useRouter();

  // AUTH
  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // State Filter Utama
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");

  // State Manajemen Data & UI
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableYears = Array.from({ length: 5 }, (_, i) => (2026 + i).toString());

  const availableMonths = [
    { value: "ALL", label: "ALL" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(
          `http://localhost:8000/api/history/analytics?year=${selectedYear}&month=${selectedMonth}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          setErrorMsg(`Backend bermasalah! Status Code: ${res.status}.`);
          return;
        }

        const json = await res.json();

        if (json.status === "success") {
          setKpis(json.kpis);
          setChartData(json.chart);
          setTableData(json.table);
        } else {
          setErrorMsg("Gagal memproses data dari server.");
        }
      } catch {
        setErrorMsg("Gagal terhubung ke server backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedYear, selectedMonth]);

  const maxKwhInChart = Math.max(...chartData.map((d) => d.total_kwh), 1);
  const maxWattInChart = Math.max(...chartData.map((d) => d.avg_power), 1);

  return (
    <>
      <MainLayout
        title="History & Analysis"
        user={user}
        onLogout={handleLogout}
        onNotificationClick={() => setIsNotificationOpen(true)}
      >
        <div className="p-4 md:p-8 flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">History Analytics</h3>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1">
                Historical load analysis and installation point grid metrics
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Filter Tahun */}
              <div className="relative inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-xl pl-3 pr-8 py-2 transition-all shadow-sm">
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-transparent text-xs sm:text-sm font-semibold text-gray-700 outline-none cursor-pointer w-full"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      Year: {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Filter Bulan */}
              <div className="relative inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-xl pl-3 pr-8 py-2 transition-all shadow-sm">
                <Filter size={14} className="text-gray-400 flex-shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-transparent text-xs sm:text-sm font-semibold text-gray-700 outline-none cursor-pointer w-full"
                >
                  {availableMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      Month: {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              {errorMsg}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Loader2 className="text-blue-600 animate-spin" size={32} />
              <p className="text-sm font-medium text-gray-500">
                Synchronizing electrical database data...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Zap size={22} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                      Accumulated Energy
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-1">
                      {kpis?.accumulated_energy?.toFixed(2) || "0.00"}{" "}
                      <span className="text-sm font-bold text-gray-500">kWh</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <DollarSign size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                      Total Cost Projection
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-1">
                      Rp {kpis?.total_cost?.toLocaleString("id-ID") || "0"}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Activity size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                      Average Base Load
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-1">
                      {kpis?.avg_base_load?.toFixed(1) || "0.0"}{" "}
                      <span className="text-sm font-bold text-gray-500">Watt</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" /> ELECTRICITY USAGE TREND (
                    {selectedMonth === "ALL"
                      ? selectedYear
                      : `${availableMonths.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
                    )
                  </h2>
                </div>

                <div className="h-64 flex items-end justify-between gap-1 pt-4 px-2 border-b border-gray-100">
                  {chartData.map((item, index) => {
                    const kwhHeight = (item.total_kwh / maxKwhInChart) * 100;

                    const wattHeight = (item.avg_power / maxWattInChart) * 100;
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group h-full justify-end relative"
                      >
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] py-2 px-3 rounded transition-opacity duration-200 pointer-events-none shadow-md whitespace-nowrap z-10">
                          <div className="font-bold mb-1">{item.label}</div>

                          <div className="text-blue-300">kWh : {item.total_kwh.toFixed(2)}</div>

                          <div className="text-violet-300">Watt : {item.avg_power.toFixed(1)}</div>
                        </div>

                        <div className="flex items-end gap-1 h-full">
                          {/* KWH */}
                          <div
                            style={{
                              height: `${item.total_kwh > 0 ? Math.max(kwhHeight, 4) : 0}%`,
                            }}
                            className={`w-[14px] sm:w-[18px] rounded-t-md transition-all duration-500
      ${
        item.total_kwh > 0
          ? "bg-gradient-to-t from-blue-600 to-cyan-400 shadow-md shadow-blue-100"
          : "bg-gray-100"
      }`}
                          />

                          {/* WATT */}
                          <div
                            style={{
                              height: `${item.avg_power > 0 ? Math.max(wattHeight, 4) : 0}%`,
                            }}
                            className={`w-[14px] sm:w-[10px] rounded-t-md transition-all duration-500
      ${item.avg_power > 0 ? "bg-gradient-to-t from-violet-400 to-violet-300" : "bg-gray-100"}`}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-3 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-6 text-[11px] text-gray-400 font-medium">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400" />
                      <span>Energy Consumption (kWh)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-violet-400 to-violet-300" />
                      <span>Average Power (W)</span>
                    </div>
                  </div>
                  <span>ⓘ Hover bars for full metrics</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Activity size={16} className="text-emerald-500" /> Energy Consumption Summary
                  </h2>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        <th className="py-4 px-6">Timeframe</th>
                        <th className="py-4 px-6 text-center">Total Energy (kWh)</th>
                        <th className="py-4 px-6 text-center">Avg Current (A)</th>
                        <th className="py-4 px-6 text-center">Avg Voltage (V)</th>
                        <th className="py-4 px-6 text-center">Avg Power (W)</th>
                        <th className="py-4 px-6 text-right">Cost Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                      {tableData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-12 text-center text-gray-400 text-xs font-medium"
                          >
                            No energy records found for the selected filter profile.
                          </td>
                        </tr>
                      ) : (
                        tableData.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-6 font-bold text-gray-900">{row.label}</td>
                            <td className="py-4 px-6 text-center font-bold text-blue-600">
                              {row.total_kwh.toFixed(2)} kWh
                            </td>
                            <td className="py-4 px-6 text-center text-gray-600">
                              {row.avg_current.toFixed(2)} A
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-xs ${row.avg_voltage < 220 ? "bg-amber-50 text-amber-600 border border-amber-200" : "text-gray-600"}`}
                              >
                                {row.avg_voltage.toFixed(1)} V
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center text-gray-600">
                              {row.avg_power.toFixed(1)} W
                            </td>
                            <td className="py-4 px-6 text-right font-bold text-gray-900 whitespace-nowrap">
                              Rp {row.total_cost.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </MainLayout>
      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
