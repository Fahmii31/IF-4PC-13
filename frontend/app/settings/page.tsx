"use client";

import React, { useEffect, useState } from "react";

import { Zap, Save, ChevronDown, Edit2, Lock } from "lucide-react";

import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";
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
  const router = useRouter();
  // AUTH
  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // POWER SETTINGS
  const [meterCapacity, setMeterCapacity] = useState("");
  const [wattLimit, setWattLimit] = useState(0);
  const [costLimit, setCostLimit] = useState(0);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedTariffId, setSelectedTariffId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // CONTROL
  const [isEditing, setIsEditing] = useState(false);

  const [isConfigured, setIsConfigured] = useState(false);

  // LOAD SETTINGS
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

  // CHANGE VA DIRECTLY TO BACKEND SO IT WON'T RESET ON REFRESH
  const handleVACapacityChange = async (value: string) => {
    if (value === "") return;

    const selectedTariff = tariffs.find((item) => `${item.daya_va} VA` === value);

    if (!selectedTariff) return;

    const confirmChange = window.confirm(
      "Changing your meter capacity will reset today's real-time chart to recalculate your usage with the new tariff. Your historical data from previous days will remain safe. Do you want to proceed?"
    );

    if (!confirmChange) return;

    // Set state secara lokal terlebih dahulu demi UI yang responsif
    setMeterCapacity(value);
    setSelectedTariffId(selectedTariff.tarif_id);

    try {
      setSaving(true);
      const token = Cookies.get("XSRF-TOKEN");

      // Langsung lakukan perubahan ke API backend agar tersimpan permanen
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
          batas_daya_watt: wattLimit, // tetap kirim limit yang ada saat ini
          batas_biaya: costLimit, // tetap kirim cost limit yang ada saat ini
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update Meter Capacity");
        await loadSettings(); // revert jika gagal
        return;
      }

      alert("Meter capacity updated successfully");
      await loadSettings(); // sinkronisasi ulang data terbaru dari backend
    } catch (error) {
      console.error(error);
      alert("Failed to connect to server");
      await loadSettings();
    } finally {
      setSaving(false);
    }
  };

  // SAVE SETTINGS WITH VALIDATION (FOR WATT & COST LIMITS)
  const saveSettings = async () => {
    if (!selectedTariffId) {
      alert("Please select meter capacity first.");
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
        alert(data.message || "Failed to save settings");

        return;
      }

      alert("Configuration saved successfully");

      setIsEditing(false);

      await loadSettings();
    } catch (error) {
      console.error(error);

      alert("Failed to connect to server");
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
        {!selectedTariffId && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h4 className="font-bold text-amber-700">Configuration Required</h4>

            <p className="text-sm text-amber-600 mt-1">
              Please select your electricity meter capacity (VA) before using VoltCore monitoring
              features.
            </p>
          </div>
        )}
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
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Select VA (Meteran)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Grid Power Level
                </label>
                <div className="relative group">
                  <select
                    value={meterCapacity}
                    disabled={saving}
                    onChange={(e) => handleVACapacityChange(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white appearance-none font-black text-gray-700 cursor-pointer transition-all hover:border-blue-200 shadow-sm disabled:opacity-50"
                  >
                    {!selectedTariffId && <option value="">Not Set</option>}

                    {tariffs.map((tariff) => (
                      <option key={tariff.tarif_id} value={`${tariff.daya_va} VA`}>
                        {tariff.daya_va} VA
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  Note: Changing this capacity will refresh today&apos;s active monitoring data to
                  apply the new electricity tariff. Past history is not affected.
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
                  onClick={() => {
                    if (!selectedTariffId) {
                      alert("Please select your meter capacity first.");
                      return;
                    }
                    setIsEditing(true);
                  }}
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

            <div
              className={`space-y-12 transition-all duration-300 ${!isEditing ? "opacity-60 pointer-events-none" : "opacity-100"}`}
            >
              {/* WATT LIMIT */}
              <div className="space-y-4 group">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800">Power Limit</h4>
                    <p className="text-xs text-gray-400">Set your maximum power threshold(W)</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        powerAlertConfigured ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <span className="text-xs font-medium text-gray-500">
                      {powerAlertConfigured
                        ? "Power Alert Monitoring Active"
                        : "Power Alert Monitoring Disabled"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm transition-all ${isEditing ? "bg-white border-blue-500" : "bg-gray-50 border-gray-100"}`}
                  >
                    {!isConfigured && !isEditing ? (
                      <div className="font-black text-lg text-gray-400">Not Set</div>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={wattLimit}
                          readOnly={!isEditing}
                          onChange={(e) => setWattLimit(Number(e.target.value))}
                          className={`w-24 font-black text-lg outline-none text-right bg-transparent ${isEditing ? "text-blue-600" : "text-gray-400"}`}
                        />
                        <span className="font-bold text-gray-400 text-sm">W</span>
                      </>
                    )}
                  </div>
                </div>

                {/* SLIDER WATT */}
                {(isConfigured || isEditing) && (
                  <input
                    type="range"
                    min="0"
                    max="9999"
                    disabled={!isEditing}
                    value={wattLimit}
                    onChange={(e) => setWattLimit(Number(e.target.value))}
                    style={getBackgroundSize(wattLimit, 9999)}
                    className={`styled-slider watt-slider ${!isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                )}
              </div>

              {/* COST LIMIT */}
              <div className="space-y-4 group">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800">Monthly Cost Limit</h4>
                    <p className="text-xs text-gray-400">Set your monthly budget limit</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        costAlertConfigured ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <span className="text-xs font-medium text-gray-500">
                      {costAlertConfigured
                        ? "Cost Alert Monitoring Active"
                        : "Cost Alert Monitoring Disabled"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm transition-all ${isEditing ? "bg-white border-emerald-500" : "bg-gray-50 border-gray-100"}`}
                  >
                    {!isConfigured && !isEditing ? (
                      <div className="font-black text-lg text-gray-400">Not Set</div>
                    ) : (
                      <>
                        <span className="font-bold text-gray-400 text-sm">Rp</span>
                        <input
                          type="number"
                          value={costLimit}
                          readOnly={!isEditing}
                          onChange={(e) => setCostLimit(Number(e.target.value))}
                          className={`w-36 font-black text-lg outline-none text-right bg-transparent ${isEditing ? "text-gray-700" : "text-gray-400"}`}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* SLIDER COST */}
                {(isConfigured || isEditing) && (
                  <input
                    type="range"
                    min="0"
                    max="999999"
                    step="10000"
                    disabled={!isEditing}
                    value={costLimit}
                    onChange={(e) => setCostLimit(Number(e.target.value))}
                    style={getBackgroundSize(costLimit, 999999)}
                    className={`styled-slider cost-slider ${!isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                )}
              </div>

              {isEditing && (
                <div className="pt-6 flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Apply Configuration"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

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
        .watt-slider {
          color: #2563eb;
        }
        .cost-slider {
          color: #10b981;
        }
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
