"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, History, Settings, LogOut, Bell, User, 
  Calendar, FileSpreadsheet, X, ChevronDown, ChevronRight, Menu
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoBlue from "@/components/LogoBlue";
import Notifications from "@/components/Notifications";

interface UsageRecord {
  date: string; energy: string; current: string; voltage: string; power: string; cost: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // State Responsif (Sama dengan Dashboard)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const [visibleRecords, setVisibleRecords] = useState(8);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-19");

  useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    
        const timer = setInterval(() => {
          setTime(new Date());
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);

  const isDateInvalid = endDate < startDate;

  const consumptionData: UsageRecord[] = [
    { date: "April 19, 2026", energy: "12.4", current: "4.2", voltage: "220.1", power: "924", cost: "1.840" },
    { date: "April 18, 2026", energy: "15.8", current: "5.1", voltage: "219.5", power: "1120", cost: "2.350" },
    { date: "April 17, 2026", energy: "11.2", current: "3.8", voltage: "220.4", power: "836", cost: "1.660" },
    { date: "April 16, 2026", energy: "14.5", current: "4.8", voltage: "221.2", power: "1060", cost: "2.100" },
    { date: "March 25, 2026", energy: "13.2", current: "4.4", voltage: "220.0", power: "968", cost: "1.950" },
    { date: "March 10, 2026", energy: "16.1", current: "5.3", voltage: "218.9", power: "1160", cost: "2.400" },
    { date: "February 14, 2026", energy: "10.8", current: "3.5", voltage: "220.5", power: "770", cost: "1.580" },
    { date: "February 02, 2026", energy: "12.9", current: "4.1", voltage: "220.2", power: "902", cost: "1.890" },
    { date: "January 28, 2026", energy: "14.0", current: "4.6", voltage: "221.0", power: "1016", cost: "2.080" },
    { date: "January 15, 2026", energy: "11.5", current: "3.9", voltage: "220.3", power: "858", cost: "1.720" },
    { date: "January 01, 2026", energy: "15.2", current: "5.0", voltage: "219.8", power: "1098", cost: "2.250" },
  ];

  const formatDateTime = (date: Date) => {
    if (!mounted) return "TIME: LOADING...";
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `TIME: ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} | ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} WIB`;
  };

  const handleLoadMore = () => {
    setVisibleRecords((prev) => prev + 5);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-gray-900 font-sans overflow-hidden">
      
      {/* OVERLAY MOBILE */}
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
                  <button onClick={() => {router.push("/history"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-blue-600 font-bold bg-blue-100/50 rounded-lg transition text-left">Consumption</button>
                  <button onClick={() => {router.push("/history/monthly"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition text-left">Monthly Report</button>
                  <button onClick={() => {router.push("/history/yearly"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition text-left">Yearly Report</button>
                </div>
              )}
            </div>
            
            <button onClick={() => {router.push("/settings"); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left">
              <Settings size={20} /> SETTINGS
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-50 bg-white">
          <button 
            onClick={() => router.push("/login")} 
            className="flex items-center justify-center gap-2 w-full py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 font-medium transition"
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white px-4 md:px-8 py-5 border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-blue-900 truncate">History & Analysis</h2>
          </div>

          <div className="hidden lg:block px-4 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-500 tracking-wider">
            {formatDateTime(time)}
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="text-gray-400 hover:text-blue-600 transition relative"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => router.push("/profile")} className="text-gray-400 hover:text-blue-600 transition">
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-4 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Consumption Records</h3>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1">Daily energy usage history since January 2026</p>
              </div>
              <button onClick={() => setShowExportModal(true)} className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 bg-[#1D6F42] text-white rounded-lg text-xs font-bold hover:bg-[#165533] transition-all shadow-lg shadow-green-900/10">
                <FileSpreadsheet size={18} /> Export Excel
              </button>
            </div>

            {/* TABLE CONTAINER - SCROLLABLE HORIZONTAL ON MOBILE */}
            <div className="px-4 md:px-8 pb-4 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[600px]">
                <thead className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold border-b border-gray-50">
                  <tr>
                    <th className="py-5 text-left">RECORD DATE</th>
                    <th className="py-5 text-center">ENERGY (KWH)</th>
                    <th className="py-5 text-center">CURRENT (A)</th>
                    <th className="py-5 text-center">VOLTAGE (V)</th>
                    <th className="py-5 text-center">POWER (W)</th>
                    <th className="py-5 text-right">COST (RP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {consumptionData.slice(0, visibleRecords).map((record, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition">
                      <td className="py-6 flex items-center gap-4">
                        <div className="p-2.5 bg-slate-50 text-blue-600 rounded-lg border border-gray-100 shrink-0"><Calendar size={18} /></div>
                        <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{record.date}</span>
                      </td>
                      <td className="py-6 text-center text-sm font-bold text-black">{record.energy}</td>
                      <td className="py-6 text-center text-sm font-bold text-black">{record.current}</td>
                      <td className="py-6 text-center text-sm font-bold text-black">{record.voltage}</td>
                      <td className="py-6 text-center text-sm font-bold text-black">{record.power}</td>
                      <td className="py-6 text-right text-sm font-bold text-blue-600 whitespace-nowrap">Rp {record.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleRecords < consumptionData.length && (
              <div className="p-8 pt-4 flex justify-center border-t border-gray-50">
                <button 
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all border border-gray-100"
                >
                  LOAD MORE RECORDS <ChevronDown size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* EXCEL MODAL */}
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-green-600">
                  <FileSpreadsheet size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Export Records</h3>
                </div>
                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500 ${isDateInvalid ? "border-red-500" : "border-gray-100"}`} 
                  />
                  {isDateInvalid && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">End date must be later than start date</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowExportModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button 
                  disabled={isDateInvalid}
                  className={`flex-1 py-3 text-sm font-bold text-white rounded-xl transition-all ${isDateInvalid ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Notifications 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}