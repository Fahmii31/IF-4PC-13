"use client";

import React, { useEffect, useState } from "react";
import {
  Zap,
  Save,
  ChevronDown,
  Edit2,
  Lock,
  AlertTriangle,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";

import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";

type Tariff = {
  tarif_id: number;
  daya_va: number;
  tarif_per_kwh: string;
  created_at: string | null;
  updated_at: string | null;
};

export default function SettingsPage() {
  const BASE_URL = "http://localhost:8000";

  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [meterCapacity, setMeterCapacity] = useState("");
  const [wattLimit, setWattLimit] = useState(0);
  const [costLimit, setCostLimit] = useState(0);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedTariffId, setSelectedTariffId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingCapacity, setPendingCapacity] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const loadSettings = async () => {
    try {
      const [settingsRes, tariffsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/settings`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }),

        fetch(`${BASE_URL}/api/tariffs`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }),
      ]);

      const settings = await settingsRes.json();
      const tariffsData = await tariffsRes.json();

      setTariffs(tariffsData);

      if (settings.configured_at) {
        setIsConfigured(true);
        setSelectedTariffId(settings.tarif_id);
        setMeterCapacity(settings.daya_va ? `${settings.daya_va} VA` : "");
        setWattLimit(settings.batas_daya_watt ?? 0);
        setCostLimit(Number(settings.batas_biaya ?? 0));
      } else {
        setIsConfigured(false);
        setSelectedTariffId(null);
        setMeterCapacity("");
        setWattLimit(0);
        setCostLimit(0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings data");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadSettings();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const handleVACapacityChange = (value: string) => {
    if (value === "" || value === meterCapacity) return;

    const selectedTariff = tariffs.find((item) => `${item.daya_va} VA` === value);
    if (!selectedTariff) return;

    setPendingCapacity(value);
    setIsConfirmModalOpen(true);
  };

  const executeVACapacityChange = async () => {
    if (!pendingCapacity) return;

    const value = pendingCapacity;
    const selectedTariff = tariffs.find((item) => `${item.daya_va} VA` === value);
    if (!selectedTariff) return;

    setIsConfirmModalOpen(false);
    setMeterCapacity(value);
    setSelectedTariffId(selectedTariff.tarif_id);

    try {
      setSaving(true);
      const token = Cookies.get("XSRF-TOKEN");

      const res = await fetch(`${BASE_URL}/api/settings`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(token || ""),
        },
        body: JSON.stringify({
          tarif_id: selectedTariff.tarif_id,
          batas_daya_watt: wattLimit,
          batas_biaya: costLimit,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(". ");
          toast.error(errorMessages);
        } else {
          toast.error(data.message || "Failed to update Meter Capacity");
        }
        await loadSettings();
        return;
      }

      toast.success("Meter capacity updated successfully!");
      await loadSettings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to server");
      await loadSettings();
    } finally {
      setSaving(false);
      setPendingCapacity(null);
    }
  };

  const cancelVACapacityChange = () => {
    setIsConfirmModalOpen(false);
    setPendingCapacity(null);
  };

  const saveSettings = async () => {
    if (!selectedTariffId) {
      toast.error("Please select meter capacity first.");
      return;
    }

    try {
      setSaving(true);

      const token = Cookies.get("XSRF-TOKEN");

      const res = await fetch(`${BASE_URL}/api/settings`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(token || ""),
        },
        body: JSON.stringify({
          tarif_id: selectedTariffId,
          batas_daya_watt: wattLimit,
          batas_biaya: costLimit,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(". ");
          toast.error(errorMessages);
        } else {
          toast.error(data.message || "Failed to save settings");
        }
        return;
      }

      toast.success("Configuration saved successfully!");
      setIsEditing(false);
      await loadSettings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  const getBackgroundSize = (val: number, max: number) => {
    return {
      backgroundSize: `${(val * 100) / max}% 100%`,
    };
  };

  const powerAlertConfigured = selectedTariffId !== null && wattLimit > 0;
  const costAlertConfigured = selectedTariffId !== null && costLimit > 0;

  return (
    <MainLayout
      title="Power Settings"
      user={user}
      onNotificationClick={() => setIsNotificationOpen(true)}
    >
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* WARNING NOT CONFIGURED */}
        {!selectedTariffId && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-800">Configuration Required</h4>
              <p className="text-xs text-amber-700 mt-1">
                Please select your electricity meter capacity (VA) before using VoltCore monitoring
                features.
              </p>
            </div>
          </div>
        )}

        {/* GRID KONTEN UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM KIRI: METER CAPACITY */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Meter Capacity</h3>
                  <p className="text-[11px] text-gray-500">Select VA (Meteran)</p>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Grid Power Level
                </label>
                <div className="relative group">
                  <select
                    value={meterCapacity}
                    disabled={saving}
                    onChange={(e) => handleVACapacityChange(e.target.value)}
                    className="w-full text-sm font-semibold px-3.5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 appearance-none outline-none transition-all hover:border-blue-300 focus:border-blue-500 focus:bg-white cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {!selectedTariffId && <option value="">Not Set</option>}
                    {tariffs.map((tariff) => (
                      <option key={tariff.tarif_id} value={`${tariff.daya_va} VA`}>
                        {tariff.daya_va} VA
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed italic">
                Note: Changing this capacity will refresh today&apos;s active monitoring data to
                apply the new electricity tariff.
              </p>
            </div>
          </div>

          {/* KOLOM KANAN: CONFIGURATION LIMITS */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
            {/* Header Konfigurasi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <SlidersHorizontal size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Configuration Limits</h3>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => {
                    if (!selectedTariffId) {
                      toast.error("Please select your meter capacity first.");
                      return;
                    }
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-all border border-gray-200 active:scale-95"
                >
                  <Edit2 size={14} /> Edit Configuration
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all border border-red-100 active:scale-95"
                >
                  <Lock size={14} /> Cancel Edit
                </button>
              )}
            </div>

            <div
              className={`space-y-4 transition-all duration-300 ${!isEditing ? "opacity-70 pointer-events-none grayscale-[20%]" : "opacity-100"}`}
            >
              {/* WATT LIMIT WRAPPER */}
              <div
                className={`p-4 rounded-xl border transition-all ${powerAlertConfigured ? "bg-gray-50/50 border-gray-200" : "bg-gray-50/30 border-gray-100"}`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Power Limit</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Set your maximum power threshold
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm h-fit">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${powerAlertConfigured ? "bg-emerald-500" : "bg-amber-500"}`}
                    />
                    <span className="text-[10px] font-semibold text-gray-600">
                      {powerAlertConfigured ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  {isConfigured || isEditing ? (
                    <input
                      type="range"
                      min="0"
                      max="9999"
                      disabled={!isEditing}
                      value={wattLimit}
                      onChange={(e) => setWattLimit(Number(e.target.value))}
                      style={getBackgroundSize(wattLimit, 9999)}
                      className={`styled-slider watt-slider w-full ${!isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                    />
                  ) : (
                    <div className="w-full h-2 bg-gray-100 rounded-full" />
                  )}

                  <div
                    className={`flex items-center gap-1.5 shrink-0 bg-white px-3 py-1.5 rounded-lg border transition-all ${isEditing ? "border-blue-400 shadow-sm" : "border-gray-200"}`}
                  >
                    {!isConfigured && !isEditing ? (
                      <span className="text-xs font-bold text-gray-400">Not Set</span>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={wattLimit}
                          readOnly={!isEditing}
                          onChange={(e) => setWattLimit(Number(e.target.value))}
                          className={`w-16 text-right text-xs font-bold bg-transparent outline-none ${isEditing ? "text-blue-600" : "text-gray-500"}`}
                        />
                        <span className="text-xs font-semibold text-gray-400">W</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* COST LIMIT WRAPPER */}
              <div
                className={`p-4 rounded-xl border transition-all ${costAlertConfigured ? "bg-gray-50/50 border-gray-200" : "bg-gray-50/30 border-gray-100"}`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Monthly Cost Limit</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Set your monthly budget limit
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm h-fit">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${costAlertConfigured ? "bg-emerald-500" : "bg-amber-500"}`}
                    />
                    <span className="text-[10px] font-semibold text-gray-600">
                      {costAlertConfigured ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  {isConfigured || isEditing ? (
                    <input
                      type="range"
                      min="0"
                      max="999999"
                      step="10000"
                      disabled={!isEditing}
                      value={costLimit}
                      onChange={(e) => setCostLimit(Number(e.target.value))}
                      style={getBackgroundSize(costLimit, 999999)}
                      className={`styled-slider cost-slider w-full ${!isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                    />
                  ) : (
                    <div className="w-full h-2 bg-gray-100 rounded-full" />
                  )}

                  <div
                    className={`flex items-center gap-1.5 shrink-0 bg-white px-3 py-1.5 rounded-lg border transition-all ${isEditing ? "border-emerald-500 shadow-sm" : "border-gray-200"}`}
                  >
                    {!isConfigured && !isEditing ? (
                      <span className="text-xs font-bold text-gray-400">Not Set</span>
                    ) : (
                      <>
                        <span className="text-xs font-semibold text-gray-400">Rp</span>
                        <input
                          type="number"
                          value={costLimit}
                          readOnly={!isEditing}
                          onChange={(e) => setCostLimit(Number(e.target.value))}
                          className={`w-20 text-right text-xs font-bold bg-transparent outline-none ${isEditing ? "text-gray-800" : "text-gray-500"}`}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Apply Configuration"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM CONFIRMATION MODAL - STYLED TO MATCH NEW COMPACT UI */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl flex-shrink-0 border border-amber-100">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Change Meter Capacity?</h3>
                <p className="text-xs text-gray-500 mt-0.5">Please confirm your action</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 leading-relaxed bg-gray-50 border border-gray-100 p-3.5 rounded-xl">
              Changing your meter capacity will reset today&apos;s real-time chart to recalculate
              your usage with the new tariff. Your historical data from previous days will remain
              safe.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={cancelVACapacityChange}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={executeVACapacityChange}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .styled-slider {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 4px;
          background-color: #f3f4f6;
          background-image: linear-gradient(currentColor, currentColor);
          background-repeat: no-repeat;
          cursor: pointer;
        }
        .watt-slider {
          color: #3b82f6; /* blue-500 */
        }
        .cost-slider {
          color: #10b981; /* emerald-500 */
        }
        .styled-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid currentColor;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </MainLayout>
  );
}
