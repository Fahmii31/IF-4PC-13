"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Notifications({ isOpen, onClose }: NotificationsProps) {
  // State lokal untuk simulasi daftar alert
  const [alerts, setAlerts] = useState([
    { id: 1, power: "5.600W", time: "21:10 WIB" },
    { id: 2, power: "5.600W", time: "20:50 WIB" },
    { id: 3, power: "5.600W", time: "20:43 WIB" },
  ]);

  if (!isOpen) return null;

  const handleClearAll = () => {
    // Menghapus daftar alert tanpa menutup modal
    setAlerts([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-[440px] rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-none">System Alerts</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">
                {alerts.length} Critical Events
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* ALERT LIST */}
        <div className="px-6 py-4 space-y-3 min-h-[150px] flex flex-col justify-center">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-center justify-between p-5 bg-red-50/30 border border-red-100/40 rounded-[20px] hover:bg-red-50 transition-colors cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-red-500 text-red-500 rounded-full">
                    <span className="font-black text-[10px]">!</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-wider mb-0.5">Critical</p>
                    <h4 className="font-bold text-gray-800 text-[13px]">Overload Detected ({alert.power})</h4>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-300 tabular-nums">{alert.time}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={20} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No active alerts</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-2">
          <button 
            onClick={handleClearAll}
            disabled={alerts.length === 0}
            className={`w-full py-4 border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
              alerts.length === 0 
                ? 'text-gray-200 cursor-not-allowed bg-gray-50/50' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-red-500'
            }`}
          >
            Clear All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}