"use client";

import React, { useState } from "react";

import {
  Zap,
  Save,
  ChevronDown,
  Edit2,
  Lock,
} from "lucide-react";

import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";

export default function SettingsPage() {

  const router = useRouter();

  // AUTH
  const {user} = useAuth();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Power Settings State
  const [meterCapacity, setMeterCapacity] = useState("1300 VA");

  const [wattLimit, setWattLimit] = useState(1200);

  const [costLimit, setCostLimit] = useState(750000);

  // Control State
  const [isEditing, setIsEditing] = useState(false);

const handleVACapacityChange = (value: string) => {
  const confirmChange = window.confirm(
    "Are you sure you want to change the VA capacity? This action will reset your current limit configurations and usage history."
  );

  if (confirmChange) {
    setMeterCapacity(value);
    alert(
      "Configuration updated. The system has been successfully reset based on the new VA capacity."
    );
  }
};

  const getBackgroundSize = (
    val: number,
    max: number
  ) => {

    return {
      backgroundSize: `${(val * 100) / max}% 100%`
    };
  };

  // LOGOUT
  const handleLogout = async () => {

    await logoutUser();

    router.replace("/login");
  };

  return (
    <MainLayout
      title="Power Settings"
      user={user}
      onLogout={handleLogout}
      onNotificationClick={() => setIsNotificationOpen(true)}
    >
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
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
                    <option value="450 VA">450 VA</option>
                    <option value="900 VA">900 VA</option>
                    <option value="1300 VA">1300 VA</option>
                    <option value="2200 VA">2200 VA</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  Pastikan ini sesuai dengan langganan meteran PLN Anda untuk menjaga akurasi monitoring VoltCore.
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
                    <p className="text-xs text-gray-400">Atur batas daya maksimum (W)</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm transition-all ${isEditing ? "bg-white border-blue-500" : "bg-gray-50 border-gray-100"}`}>
                    <input
                      type="number"
                      value={wattLimit}
                      readOnly={!isEditing}
                      onChange={(e) => setWattLimit(Number(e.target.value))}
                      className={`w-24 font-black text-lg outline-none text-right bg-transparent ${isEditing ? "text-blue-600" : "text-gray-400"}`}
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
                    <p className="text-xs text-gray-400">Atur anggaran biaya bulanan Anda</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm transition-all ${isEditing ? "bg-white border-emerald-500" : "bg-gray-50 border-gray-100"}`}>
                    <span className="font-bold text-gray-400 text-sm">Rp</span>
                    <input
                      type="number"
                      value={costLimit}
                      readOnly={!isEditing}
                      onChange={(e) => setCostLimit(Number(e.target.value))}
                      className={`w-36 font-black text-lg outline-none text-right bg-transparent ${isEditing ? "text-gray-700" : "text-gray-400"}`}
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

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      <style jsx global>{`
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
    </MainLayout>
  );
}