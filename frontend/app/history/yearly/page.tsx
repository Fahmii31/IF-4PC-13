"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Zap,
  CreditCard,
  ChevronDown
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";
import ZapIcon from "@/components/ZapIcon";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";

export default function YearlyReportPage() {

  const router = useRouter();

  // AUTH
  const {user} = useAuth();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const today = useMemo(() => new Date(), []);

  const currentMonth = today.getMonth();

  const currentYear = 2026;

  const [selectedYear, setSelectedYear] = useState(
    currentYear.toString()
  );

  const [activeUnit, setActiveUnit] = useState<"cost" | "kwh">("cost");

  const yearOptions = useMemo(
    () => ["2024", "2025", "2026", "2027", "2028", "2029", "2030"],
    []
  );

  const monthLabels = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    []
  );

  // LOGOUT
  const handleLogout = async () => {

    await logoutUser();

    router.replace("/login");
  };

  const chartData = useMemo(() => {

    return monthLabels.map((month, index) => {

      const yearInt = parseInt(selectedYear);

      let cost = 0;

      let kwh = 0;

      const hasData =
        yearInt < currentYear ||
        (yearInt === currentYear && index <= currentMonth);

      if (hasData) {

        // Seed data stabil untuk VoltCore (Monitoring 1 Titik)
        const baseValue =
          (Math.sin(index + yearInt) + 2) * 120000;

        cost = Math.floor(baseValue) + 80000;

        kwh = Number((cost / 1500).toFixed(1));
      }

      return {
        month: month,
        cost: cost,
        kwh: kwh,
        isFuture: !hasData
      };
    });

  }, [selectedYear, currentMonth, currentYear, monthLabels]);

  const totals = useMemo(() => {

    const totalCost = chartData.reduce(
      (acc, curr) => acc + curr.cost,
      0
    );

    const totalKwh = chartData.reduce(
      (acc, curr) => acc + curr.kwh,
      0
    );

    return {
      cost: totalCost.toLocaleString("id-ID"),
      kwh: totalKwh.toLocaleString("id-ID")
    };

  }, [chartData]);

  return (
    <MainLayout
      title="Yearly Analysis"
      user={user}
      onLogout={handleLogout}
      onNotificationClick={() => setIsNotificationOpen(true)}
    >
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Overview Report</h2>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex items-center bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
              <Calendar size={18} className="text-blue-600 mr-2" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none appearance-none pr-6 cursor-pointer"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
              Total Annual Consumption - {selectedYear}
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <h3 className="text-4xl md:text-5xl font-bold text-blue-900 leading-none">
                {totals.kwh} <span className="text-lg font-medium text-gray-300">kWh</span>
              </h3>
              <div className="hidden md:block h-10 w-[1px] bg-gray-100"></div>
              <h3 className="text-4xl md:text-5xl font-bold text-blue-900 leading-none">
                <span className="text-lg font-medium text-gray-300">Rp</span> {totals.cost}
              </h3>
            </div>
          </div>
          <ZapIcon className="w-24 h-24 text-gray-50 absolute right-4 top-1/2 -translate-y-1/2 rotate-12" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Monthly Expenses Comparison</h3>
              <p className="text-xs text-gray-400">Visualization for {selectedYear}</p>
            </div>
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setActiveUnit("cost")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeUnit === "cost" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
              >
                <CreditCard size={14} /> COST
              </button>
              <button
                onClick={() => setActiveUnit("kwh")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeUnit === "kwh" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
              >
                <Zap size={14} /> kWh
              </button>
            </div>
          </div>

          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={(val) => activeUnit === "cost" ? `${val / 1000}k` : val}
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey={activeUnit} radius={[4, 4, 0, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isFuture ? "#F1F5F9" : "#2563eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </MainLayout>
  );
}