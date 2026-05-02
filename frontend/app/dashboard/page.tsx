"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Bell,
  User,
  AlertTriangle,
  Zap,
  Gauge,
  Wallet,
  Menu, // Tambahkan ini
  X    // Tambahkan ini
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useRouter } from "next/navigation";
import LogoBlue from "@/components/LogoBlue";
import Notifications from "@/components/Notifications";

export default function DashboardPage() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);
  const [powerOn, setPowerOn] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  // STATE UNTUK MOBILE RESPONSIVE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dataTrend = useMemo(() => [
    { time: "00:00", kwh: 15 },
    { time: "06:00", kwh: 18 },
    { time: "12:00", kwh: 14 },
    { time: "18:00", kwh: 21 },
    { time: "20:00", kwh: 24 },
    { time: "23:59", kwh: 20 },
  ], []);

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
  
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);

  const formatDateTime = (date: Date) => {
    if (!mounted) return "TIME: LOADING...";
    const day = date.getDate();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `TIME: ${day} ${month} ${year} | ${hours}:${minutes} WIB`;
  };

  return (
    <div className="flex h-screen bg-slate-50 text-gray-900 font-sans overflow-hidden">
      
      {/* OVERLAY UNTUK MOBILE (Muncul saat sidebar terbuka) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
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
        <div className="flex-1 overflow-y-auto">
          {/* LOGO AREA & CLOSE BUTTON (Close button hanya muncul di mobile) */}
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

          <nav className="px-4 space-y-2">
            <button 
              onClick={() => { router.push("/dashboard"); setIsSidebarOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold transition text-left"
            >
              <LayoutDashboard size={20} /> DASHBOARD
            </button>
            <button 
              onClick={() => { router.push("/history"); setIsSidebarOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left"
            >
              <History size={20} /> HISTORY
            </button>
            <button 
              onClick={() => { router.push("/settings"); setIsSidebarOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left"
            >
              <Settings size={20} /> SETTINGS
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 w-full py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 font-medium transition"
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white px-4 md:px-8 py-5 border-b border-gray-100 sticky top-0 z-30">
          
          <div className="flex items-center gap-3 flex-1">
            {/* TOMBOL GARIS 3 (Hanya muncul di Mobile) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg transition"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-blue-900 truncate">Dashboard Overview</h2>
          </div>

          {/* DATE TIME (Sembunyi di mobile kecil, muncul di layar besar) */}
          <div className="hidden lg:block">
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-500 tracking-wider whitespace-nowrap">
              {formatDateTime(time)}
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center gap-3 md:gap-6">
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="text-gray-400 hover:text-blue-600 transition relative"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => router.push("/profile")}
              className="text-gray-400 hover:text-blue-600 transition"
            >
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-4 md:p-8 flex-1">
          {/* ALERT BANNER */}
          {showAlert && (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-red-100/80 border border-red-200 text-red-700 px-4 md:px-6 py-4 rounded-xl mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-red-500 text-white p-1.5 rounded-lg shrink-0"><AlertTriangle size={20} /></div>
                <div>
                  <h4 className="font-bold text-sm md:text-base">Alert: Power Is Over</h4>
                  <p className="text-xs md:text-sm opacity-90">Current usage (30 watts) has reached the limit</p>
                </div>
              </div>
              <button onClick={() => setShowAlert(false)} className="text-xs font-bold tracking-wider hover:opacity-70 transition uppercase self-end md:self-center">Dismiss</button>
            </div>
          )}

          {/* METRICS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
            {[
              { label: "Current", val: "12.4", unit: "A" },
              { label: "Power", val: "2,840", unit: "W" },
              { label: "Voltage", val: "231", unit: "V" },
              { label: "Energy", val: "18.2", unit: "kWh" },
            ].map((item) => (
              <div key={item.label} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-50">
                <p className="text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">{item.label}</p>
                <h3 className="text-xl md:text-3xl font-bold text-gray-900">{item.val} <span className="text-sm md:text-lg text-gray-500">{item.unit}</span></h3>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-1 bg-blue-100 p-4 md:p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-center">
              <p className="text-[10px] md:text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Today&apos;s Cost</p>
              <h3 className="text-xl md:text-2xl font-bold text-blue-900">Rp 27,450</h3>
            </div>
          </div>

          {/* GRID UNTUK CONTROL DAN CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 order-2 lg:order-1">
              {/* Power Control Card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center h-56 md:h-64">
                <h3 className="text-base md:text-lg font-bold text-gray-800 w-full text-left mb-6">Power Control</h3>
                <button
                  onClick={() => setPowerOn(!powerOn)}
                  className={`w-20 md:w-24 h-10 md:h-12 rounded-full flex items-center transition-colors duration-300 px-1 ${powerOn ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Zap size={18} className={powerOn ? "text-blue-600" : "text-gray-400"} fill={powerOn ? "currentColor" : "none"} />
                  </div>
                </button>
                <p className={`mt-6 font-bold tracking-wider text-[10px] md:text-sm ${powerOn ? 'text-blue-600' : 'text-gray-500'}`}>
                  SYSTEM: POWER {powerOn ? 'ON' : 'OFF'}
                </p>
              </div>

              {/* Settings Preview Card */}
              <div className="bg-gray-100/50 p-6 rounded-3xl border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-gray-600 tracking-wider uppercase">Settings & Limits</h3>
                  <button onClick={() => router.push("/settings")} className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Max Watt</p>
                      <p className="font-bold text-gray-900 text-sm">1,200 W</p>
                    </div>
                    <Gauge className="text-gray-300" size={20} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Cost Limit</p>
                      <p className="font-bold text-gray-900 text-sm">Rp 750k</p>
                    </div>
                    <Wallet className="text-gray-300" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col order-1 lg:order-2">
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Energy Usage Trend</h3>
                  <p className="text-xs text-gray-500 mt-1">Real-time monitoring</p>
                </div>
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] md:text-sm font-bold uppercase">Today</div>
              </div>

              <div className="flex-1 w-full min-h-[250px] md:min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataTrend} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(value) => `${value}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="kwh" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL NOTIFIKASI */}
      <Notifications 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />

    </div>
  );
}