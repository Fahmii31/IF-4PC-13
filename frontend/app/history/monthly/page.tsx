"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, Zap, CreditCard, ChevronDown 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";
import ZapIcon from "@/components/ZapIcon";

type User = {
  id: number;
  username: string;
  email: string;
  phone: string; // Tetap ditambahkan agar tidak error tipe data
};

export default function MonthlyReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Penentu batas waktu hari ini (8 Mei 2026)
  const today = new Date();
  const currentMonth = today.getMonth(); // 4 untuk Mei
  const currentDay = today.getDate(); // 8
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [activeUnit, setActiveUnit] = useState<"cost" | "kwh">("cost");

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  const chartData = useMemo(() => {
    const monthIndex = parseInt(selectedMonth);

    return Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      
      let cost = 0;
      let kwh = 0;

      // Logika data kosong:
      // Data hanya diisi jika:
      // 1. Bulan yang dipilih sebelum Mei (Jan-Apr)
      // 2. Bulan yang dipilih adalah Mei DAN tanggalnya <= 8
      if (monthIndex < currentMonth || (monthIndex === currentMonth && day <= currentDay)) {
        const baseValue = (Math.sin(day + monthIndex) + 1.5) * 5000;
        cost = Math.floor(baseValue) + 4000;
        kwh = Number((cost / 1500).toFixed(2));
      }

      return {
        day: `${day}`,
        cost: cost,
        kwh: kwh,
      };
    });
  }, [selectedMonth, currentMonth, currentDay]);

  const totals = useMemo(() => {
    const totalCost = chartData.reduce((acc, curr) => acc + curr.cost, 0);
    const totalKwh = chartData.reduce((acc, curr) => acc + curr.kwh, 0);
    return {
      cost: totalCost.toLocaleString("id-ID"),
      kwh: totalKwh.toFixed(1)
    };
  }, [chartData]);

  return (
    <MainLayout
      title="Monthly Analysis"
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
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none appearance-none pr-6 cursor-pointer"
              >
                {/* Dropdown tetap menampilkan semua bulan dari Jan - Des */}
                {monthOptions.map((name, index) => (
                  <option key={index} value={index}>{name} 2026</option>
                ))}
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
              Total Usage & Cost - {monthOptions[parseInt(selectedMonth)]}
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <h3 className="text-4xl md:text-5xl font-bold text-blue-900 leading-none">
                {mounted ? totals.kwh : "0"} <span className="text-lg font-medium text-gray-300">kWh</span>
              </h3>
              <div className="hidden md:block h-10 w-[1px] bg-gray-100"></div>
              <h3 className="text-4xl md:text-5xl font-bold text-blue-900 leading-none">
                <span className="text-lg font-medium text-gray-300">Rp</span> {mounted ? totals.cost : "0"}
              </h3>
            </div>
          </div>
          <ZapIcon className="w-24 h-24 text-gray-50 absolute right-4 top-1/2 -translate-y-1/2 rotate-12" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Daily Expenses Comparison</h3>
              <p className="text-xs text-gray-400">Data visualization for current month</p>
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
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  {/* Warna Bar diubah kembali menjadi Biru Terang (#2563eb) */}
                  <Bar dataKey={activeUnit} radius={[4, 4, 0, 0]} fill="#2563eb" barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </MainLayout>
  );
}