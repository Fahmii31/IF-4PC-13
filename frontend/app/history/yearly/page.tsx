"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, History, Settings, LogOut, Bell, User, 
  ChevronDown, ChevronRight, Calendar, Zap, CreditCard, Menu, X 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { useRouter } from "next/navigation";
import LogoBlue from "@/components/LogoBlue";
import ZapIcon from "@/components/ZapIcon";
import Notifications from "@/components/Notifications";

export default function YearlyReportPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  
  // State Responsif
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Filter State
  const [selectedYear, setSelectedYear] = useState("2026");
  const [activeUnit, setActiveUnit] = useState<"cost" | "kwh">("cost");

  const yearOptions = ["2024", "2025", "2026"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
  
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);

    const chartData = useMemo(() => {
    return monthLabels.map((month, index) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const isFuture = (parseInt(selectedYear) > currentYear) || 
                       (parseInt(selectedYear) === currentYear && index > currentMonth);

      // eslint-disable-next-line react-hooks/purity
      const generatedCost = isFuture ? 0 : Math.floor(Math.random() * 300000) + 150000;
      
      return {
        month: month,
        cost: generatedCost,
        kwh: Number((generatedCost / 1500).toFixed(1)),
        isFuture: isFuture
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const totals = useMemo(() => {
    const totalCost = chartData.reduce((acc, curr) => acc + curr.cost, 0);
    const totalKwh = chartData.reduce((acc, curr) => acc + curr.kwh, 0);
    
    return {
      cost: totalCost.toLocaleString("id-ID"),
      kwh: totalKwh.toLocaleString("id-ID")
    };
  }, [chartData]);

  const formatDateTime = (date: Date) => {
    if (!mounted) return "TIME: LOADING...";
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `TIME: ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} | ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} WIB`;
  };

  return (
    <div className="flex h-screen bg-slate-50 text-gray-900 font-sans overflow-hidden">
      
      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col h-screen
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:flex-shrink-0
      `}>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between p-6 mb-4">
            <div className="flex items-center gap-3">
              <LogoBlue />
              <div>
                <h1 className="text-blue-600 font-bold text-xl leading-none">VoltCore</h1>
                <p className="text-[10px] tracking-widest text-gray-500 mt-1 uppercase">Power Intelligence</p>
              </div>
            </div>
            <button className="md:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="px-4 space-y-1">
            <button onClick={() => {router.push("/dashboard"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left">
              <LayoutDashboard size={20} /> DASHBOARD
            </button>
            
            <div className="space-y-1">
              <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold bg-blue-50 text-blue-600 transition text-left">
                <div className="flex items-center gap-3"><History size={20} /> HISTORY</div>
                {isHistoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {isHistoryOpen && (
                <div className="ml-9 space-y-1 pr-2">
                  <button onClick={() => {router.push("/history"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition text-left">Consumption</button>
                  <button onClick={() => {router.push("/history/monthly"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition text-left">Monthly Report</button>
                  <button onClick={() => {router.push("/history/yearly"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-blue-600 font-bold bg-blue-100/50 rounded-lg transition text-left">Yearly Report</button>
                </div>
              )}
            </div>
            
            <button onClick={() => {router.push("/settings"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left">
              <Settings size={20} /> SETTINGS
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-50 bg-white">
          <button onClick={() => router.push("/login")} className="flex items-center justify-center gap-2 w-full py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 font-medium transition">
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="flex items-center justify-between bg-white px-4 md:px-8 py-5 border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 md:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-blue-900 truncate">Yearly Analysis</h2>
          </div>

          <div className="hidden lg:block px-4 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-500 tracking-wider">
            {formatDateTime(time)}
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => setIsNotificationOpen(true)} className="text-gray-400 hover:text-blue-600 transition relative">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => router.push("/profile")} className="text-gray-400 hover:text-blue-600 transition"><User size={24} /></button>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">Overview Report</h2>
            <div className="relative flex items-center bg-white rounded-xl px-4 py-2.5 border border-gray-200 shadow-sm w-full sm:w-auto">
              <Calendar size={18} className="text-blue-600 mr-3" />
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer appearance-none pr-8 w-full">
                {yearOptions.map((year) => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
              <ChevronDown size={16} className="text-gray-400 absolute right-4 pointer-events-none" />
            </div>
          </div>

          {/* TOTAL ANNUAL CARDS */}
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-50 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-400 mb-4 md:mb-2 uppercase tracking-[0.2em]">Total Annual Consumption - {selectedYear}</p>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <h3 className="text-4xl md:text-6xl font-bold text-blue-900 leading-none">
                  {mounted ? totals.kwh : "0"} <span className="text-xl md:text-2xl font-medium text-gray-300 uppercase">kWh</span>
                </h3>
                <div className="hidden md:block h-12 w-[2px] bg-gray-100"></div>
                <h3 className="text-4xl md:text-6xl font-bold text-blue-900 leading-none">
                  <span className="text-xl md:text-2xl font-medium text-gray-300 uppercase">Rp</span> {mounted ? totals.cost : "0"}
                </h3>
              </div>
            </div>
            <ZapIcon className="w-24 h-24 md:w-32 md:h-32 text-gray-50 absolute right-4 md:right-12 top-1/2 -translate-y-1/2 rotate-12 opacity-50 md:opacity-100" />
          </div>

          {/* MONTHLY CHART */}
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Monthly Expenses Comparison</h3>
                <p className="text-xs text-gray-400 mt-1">Full year data for {selectedYear}</p>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-lg self-start sm:self-center">
                <button onClick={() => setActiveUnit("cost")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeUnit === "cost" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
                  <CreditCard size={14} /> COST
                </button>
                <button onClick={() => setActiveUnit("kwh")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeUnit === "kwh" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
                  <Zap size={14} /> kWh
                </button>
              </div>
            </div>

            <div className="h-64 md:h-80 w-full overflow-hidden"> 
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 9 }} 
                      tickFormatter={(val) => activeUnit === "cost" ? `${val/1000}k` : val} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                    />
                    <Bar dataKey={activeUnit} radius={[4, 4, 0, 0]} barSize={window.innerWidth < 768 ? 14 : 32}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isFuture ? "#F1F5F9" : "#004791"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </main>

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}