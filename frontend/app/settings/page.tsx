"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Bell,
  User,
  Zap,
  Save,
  ChevronDown,
  ChevronRight,
  Edit2,
  Lock,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoBlue from "@/components/LogoBlue";
import Notifications from "@/components/Notifications";

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  const [meterCapacity, setMeterCapacity] = useState("1300 VA");
  const [wattLimit, setWattLimit] = useState(1200);
  const [costLimit, setCostLimit] = useState(750000);

  // State Kontrol
  const [isEditing, setIsEditing] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

 useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
  
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);

  const handleVACapacityChange = (value: string) => {
    const confirmChange = window.confirm(
      "PERINGATAN: Mengubah kapasitas VA akan mereset semua limit konfigurasi dan riwayat (history) penggunaan Anda. Apakah Anda yakin ingin melanjutkan?"
    );

    if (confirmChange) {
      setMeterCapacity(value);
      alert("Sistem telah di-reset ulang sesuai kapasitas VA baru.");
    }
  };

  const formatDateTime = (date: Date) => {
    if (!mounted) return "TIME: LOADING...";
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `SERVER TIME: ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} | ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} WIB`;
  };

  const getBackgroundSize = (val: number, max: number) => {
    return { backgroundSize: `${(val * 100) / max}% 100%` };
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900 font-sans overflow-x-hidden">
      
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
            <button 
              onClick={() => {router.push("/dashboard"); setIsSidebarOpen(false);}} 
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left"
            >
              <LayoutDashboard size={20} /> DASHBOARD
            </button>

            <div className="space-y-1">
              <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
                className="flex items-center justify-between w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left"
              >
                <div className="flex items-center gap-3"><History size={20} /> HISTORY</div>
                {isHistoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {isHistoryOpen && (
                <div className="ml-9 space-y-1 pr-2">
                  <button onClick={() => {router.push("/history"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition text-left">Consumption</button>
                  <button onClick={() => {router.push("/history/monthly"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition text-left">Monthly Report</button>
                  <button onClick={() => {router.push("/history/yearly"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition text-left">Yearly Report</button>
                </div>
              )}
            </div>

            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold transition text-left">
              <Settings size={20} /> SETTINGS
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-50 bg-white">
          <button onClick={() => router.push("/login")} className="flex items-center justify-center gap-2 w-full py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 font-medium transition text-left">
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between bg-white px-4 md:px-8 py-5 border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 md:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-blue-900 truncate tracking-tight">Power Settings</h2>
          </div>

          <div className="hidden lg:block px-4 py-2 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-400 tracking-widest">
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

        <div className="p-4 md:p-8 flex-1 overflow-y-auto space-y-6 md:space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

            {/* METER CAPACITY */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Meter Capacity</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Select VA (Meteran)</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Grid Power Level</label>
                  <div className="relative group">
                    <select
                      value={meterCapacity}
                      onChange={(e) => handleVACapacityChange(e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white appearance-none font-black text-gray-700 cursor-pointer transition-all hover:border-blue-200 shadow-sm"
                    >
                      <option value="900 VA">900 VA</option>
                      <option value="1300 VA">1300 VA</option>
                      <option value="2200 VA">2200 VA</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                      <ChevronDown size={20} strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">
                    Ensure this matches your actual PLN meter subscription to maintain accuracy.
                  </p>
                </div>
              </div>
            </div>

            {/* CONFIGURATION LIMITS */}
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-50">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span> Configuration Limits
                </h3>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100"
                  >
                    <Edit2 size={14} /> Edit Configuration
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100"
                  >
                    <Lock size={14} /> Cancel Edit
                  </button>
                )}
              </div>

              <div className={`space-y-12 transition-all duration-300 ${!isEditing ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
                
                {/* WATT LIMIT */}
                <div className="space-y-4 group">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                    <div>
                      <h4 className="font-bold text-gray-800">Power Limit</h4>
                      <p className="text-xs text-gray-400">Enter maximum power limit</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm transition-all ${isEditing ? "bg-white border-blue-500" : "bg-gray-50 border-gray-100"}`}>
                      <input
                        type="number"
                        value={wattLimit}
                        readOnly={!isEditing}
                        onChange={(e) => setWattLimit(Number(e.target.value))}
                        className={`w-24 font-black text-lg outline-none text-right bg-transparent ${isEditing ? "text-blue-600" : "text-gray-400"}`}
                        placeholder="0"
                      />
                      <span className="font-bold text-gray-400 text-sm">W</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2200"
                    disabled={!isEditing}
                    value={wattLimit}
                    onChange={(e) => setWattLimit(Number(e.target.value))}
                    style={getBackgroundSize(wattLimit, 2200)}
                    className={`styled-slider watt-slider ${!isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>

                {/* COST LIMIT */}
                <div className="space-y-4 group">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                    <div>
                      <h4 className="font-bold text-gray-800">Monthly Cost Limit</h4>
                      <p className="text-xs text-gray-400">Enter your monthly budget</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm transition-all ${isEditing ? "bg-white border-emerald-500" : "bg-gray-50 border-gray-100"}`}>
                      <span className="font-bold text-gray-400 text-sm">Rp</span>
                      <input
                        type="number"
                        value={costLimit}
                        readOnly={!isEditing}
                        onChange={(e) => setCostLimit(Number(e.target.value))}
                        className={`w-36 font-black text-lg outline-none text-right bg-transparent ${isEditing ? "text-gray-700" : "text-gray-400"}`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="10000"
                    disabled={!isEditing}
                    value={costLimit}
                    onChange={(e) => setCostLimit(Number(e.target.value))}
                    style={getBackgroundSize(costLimit, 2000000)}
                    className={`styled-slider cost-slider ${!isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>

                {isEditing && (
                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        alert("Konfigurasi berhasil disimpan!");
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20"
                    >
                      <Save size={18} /> Apply Configuration
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        
        input[type='number']::-webkit-inner-spin-button, 
        input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

        .styled-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 5px;
          background-color: #f3f4f6;
          background-image: linear-gradient(currentColor, currentColor);
          background-repeat: no-repeat;
          cursor: pointer;
        }
        .watt-slider { color: #2563eb; }
        .cost-slider { color: #10b981; }
        .styled-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid currentColor;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}