"use client";

import React, { useState, useEffect } from "react";
import { Zap, DollarSign, Activity, Calendar, Filter, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Komponen import sesuai dengan history/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";

// Tipe data pencocokan response JSON dari API Laravel Analytics
type KPIData = {
  accumulated_energy: number;
  total_cost: number;
  avg_base_load: number;
};

type ChartItem = {
  month: string;
  total_kwh: number;
};

type TableItem = {
  month_num: number;
  month_name: string;
  avg_current: number;
  avg_voltage: number;
  avg_power: number;
  total_cost: number;
};

export default function HistoryAnalyticsPage() {
  const router = useRouter();

  // AUTH (Meniru persis history/page.tsx)
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

  // Generate opsi tahun secara dinamis (2026 - 2030)
  const availableYears = Array.from({ length: 5 }, (_, i) => (2026 + i).toString());

  // Definisi opsi bulan
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

  // LOGOUT (Meniru persis history/page.tsx)
  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  // AMBIL DATA BERDASARKAN MEKANISME COOKIE SANCTUM
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
        // FIX: Menghapus variabel 'err' yang tidak digunakan untuk mengatasi error ESLint3
        setErrorMsg("Gagal terhubung ke server backend (Pastikan server Laravel berjalan).");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedYear, selectedMonth]);

  // Cari nilai tertinggi di chart untuk kalkulasi tinggi batang grafik secara proporsional
  const maxKwhInChart = Math.max(...chartData.map((d) => d.total_kwh), 1);

  return (
    <>
      <MainLayout
        title="History & Analysis"
        user={user}
        onLogout={handleLogout}
        onNotificationClick={() => setIsNotificationOpen(true)}
      >
        <div className="p-4 md:p-8 flex-1 space-y-8">
          {/* ==================== SECTION 1: FILTERS AND SUB-HEADER ==================== */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">History Analytics</h3>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1">
                Historical load analysis and installation point grid metrics
              </p>
            </div>

            {/* Filter Container dengan urutan: Year (Kiri), Month (Kanan) */}
            <div className="flex items-center gap-3">
              {/* Dropdown Year */}
              <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer w-fit min-w-0 pr-4"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      Year: {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Month */}
              <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Filter size={14} className="text-gray-400 flex-shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer w-fit min-w-0 pr-4"
                >
                  {availableMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      Month: {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ERROR HANDLER ALERT VIEW */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              {errorMsg}
            </div>
          )}

          {/* LOADING STATE SPLASH */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Loader2 className="text-blue-600 animate-spin" size={32} />
              <p className="text-sm font-medium text-gray-500">
                Synchronizing electrical database data...
              </p>
            </div>
          ) : (
            <>
              {/* ==================== SECTION 2: TOP KPI OVERVIEW CARDS ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* CARD 1: Accumulated Energy */}
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Zap size={22} fill="currentColor" className="text-blue-600" />
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

                {/* CARD 2: Total Cost */}
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

                {/* CARD 3: Average Base Load */}
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

              {/* ==================== SECTION 3: CONSUMPTION CHART TREND ==================== */}
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    Consumption Chart Trend ({selectedYear})
                  </h2>
                </div>

                {/* Render Batang Grafis 12 Bulan Penuh */}
                <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2 border-b border-gray-100">
                  {chartData.map((item, index) => {
                    const barHeightPercent = (item.total_kwh / maxKwhInChart) * 100;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group h-full justify-end"
                      >
                        {/* Tooltip Angka Kwh saat di-hover */}
                        <div className="opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] py-1 px-2 rounded mb-2 transition-opacity duration-200 pointer-events-none shadow-md whitespace-nowrap">
                          {item.total_kwh.toFixed(2)} kWh
                        </div>

                        {/* Batang Biru */}
                        <div
                          style={{
                            height: `${item.total_kwh > 0 ? Math.max(barHeightPercent, 4) : 0}%`,
                          }}
                          className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 origin-bottom
                            ${
                              item.total_kwh > 0
                                ? "bg-gradient-to-t from-blue-600 to-cyan-400 shadow-md shadow-blue-100 group-hover:from-blue-500 group-hover:to-cyan-300"
                                : "bg-gray-100"
                            }
                          `}
                        />

                        {/* Label Bulan Sumbu X */}
                        <span className="text-xs font-bold text-gray-400 mt-3 group-hover:text-blue-600 transition-colors">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-6 text-[11px] text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400" />
                    <span>Energy (kWh)</span>
                  </div>
                  <span>ⓘ Hover bars for full metrics</span>
                </div>
              </div>

              {/* ==================== SECTION 4: STABILITY & LOAD DISTRIBUTION MATRIX ==================== */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Activity size={16} className="text-emerald-500" />
                    Stability & Load Distribution Matrix
                  </h2>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        <th className="py-4 px-6">Timeframe</th>
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
                            colSpan={5}
                            className="py-12 text-center text-gray-400 text-xs font-medium"
                          >
                            No energy records found for the selected filter profile.
                          </td>
                        </tr>
                      ) : (
                        tableData.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-6 font-bold text-gray-900">{row.month_name}</td>
                            <td className="py-4 px-6 text-center text-gray-600">
                              {row.avg_current.toFixed(2)} A
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-xs
                                ${
                                  row.avg_voltage < 220
                                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                                    : "text-gray-600"
                                }
                              `}
                              >
                                {row.avg_voltage.toFixed(1)} V
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center text-gray-600">
                              {row.avg_power.toFixed(1)} W
                            </td>
                            <td className="py-4 px-6 text-right font-bold text-blue-600 whitespace-nowrap">
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
