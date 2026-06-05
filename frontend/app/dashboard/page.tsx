"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle, Zap, Gauge, Wallet, Loader2, ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

import Notifications from "@/components/Notifications";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000/api";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [showAlert, setShowAlert] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Optimistic UI agar relay tidak delay
  const [isToggling, setIsToggling] = useState(false);

  const [deviceInfo, setDeviceInfo] = useState({
    nama_perangkat: "VoltCore Device",
    kode_device: "-",
    status_relay: false,
    is_online: true,
    last_seen: "Just Now",
  });

  const [metrics, setMetrics] = useState({
    arus_ampere: 0,
    daya_watt: 0,
    tegangan_volt: 0,
    energi_kwh: 0,
    estimasi_biaya: 0,
  });

  const [userLimits, setUserLimits] = useState({
    tarif_id: null as number | null,
    daya_va: 0,
    batas_daya_watt: 0,
    batas_biaya: 0,
    isConfigured: false,
  });

  const [dataTrend, setDataTrend] = useState([]);
  const relayStatusRef = useRef(false);

  const syncDashboard = useCallback(async () => {
    try {
      const [resOverview, resSettings] = await Promise.all([
        fetch(`${API_URL}/dashboard/overview`, { credentials: "include", cache: "no-store" }),
        fetch(`${API_URL}/settings`, { credentials: "include" }),
      ]);

      if (resOverview.status === 401) {
        router.replace("/login");
        return;
      }

      if (resOverview.ok && resSettings.ok) {
        const jsonOverview = await resOverview.json();
        const jsonSettings = await resSettings.json();

        // Hanya update state jika sedang tidak dalam proses toggle (mencegah flickering)
        if (!isToggling) {
          setDeviceInfo(jsonOverview.device);
        }

        relayStatusRef.current = !!jsonOverview.device.status_relay;

        setMetrics(
          jsonOverview.device.status_relay
            ? jsonOverview.metrics
            : {
                arus_ampere: 0,
                daya_watt: 0,
                tegangan_volt: 0,
                energi_kwh: jsonOverview.metrics.energi_kwh,
                estimasi_biaya: 0,
              }
        );

        setDataTrend(jsonOverview.chart_trend || []);
        setUserLimits({
          tarif_id: jsonSettings.tarif_id || null,
          daya_va: jsonSettings.daya_va || 0,
          batas_daya_watt: jsonSettings.batas_daya_watt || 0,
          batas_biaya: Number(jsonSettings.batas_biaya || 0),
          isConfigured: !!jsonSettings.configured_at, // Pastikan logika ini selaras dengan kebutuhan Anda
        });
      }
    } catch (err) {
      console.error("Sync gagal:", err);
    }
  }, [router, isToggling]);

  useEffect(() => {
    const init = async () => {
      await syncDashboard();
      setIsLoading(false);
    };
    init();

    const interval = setInterval(syncDashboard, 10000);
    return () => clearInterval(interval);
  }, [syncDashboard]);

  const handleToggleRelay = async () => {
    if (isToggling) return; // Cegah double-click
    setIsToggling(true);

    const target = !deviceInfo.status_relay;

    // OPTIMISTIC UPDATE: Langsung rubah UI tanpa menunggu API
    setDeviceInfo((prev) => ({ ...prev, status_relay: target }));

    try {
      const res = await fetch(`${API_URL}/device/toggle-relay`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(Cookies.get("XSRF-TOKEN") || ""),
        },
        body: JSON.stringify({ status_relay: target }),
        credentials: "include",
      });

      if (!res.ok) throw new Error();
      // Sinkronisasi background setelah berhasil
      syncDashboard();
    } catch {
      // REVERT jika gagal ke API
      setDeviceInfo((prev) => ({ ...prev, status_relay: !target }));
      alert("Gagal update status relay.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const isPowerOverLimit =
    userLimits.batas_daya_watt > 0 && metrics.daya_watt >= userLimits.batas_daya_watt;

  return (
    <>
      <MainLayout
        title="Dashboard Overview"
        user={user}
        onLogout={handleLogout}
        onNotificationClick={() => setIsNotificationOpen(true)}
      >
        {!userLimits.isConfigured && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-amber-50 border border-amber-200 text-amber-800 px-4 md:px-6 py-4 rounded-xl mb-6 gap-4 shadow-sm animate-pulse">
            <div>
              <h4 className="font-bold text-sm md:text-base">Configuration Required</h4>
              <p className="text-xs md:text-sm opacity-90">
                You haven&apos;t selected your household electricity capacity (VA) yet. Please
                configure it first for accurate cost calculations.
              </p>
            </div>
            <button
              onClick={() => router.push("/settings")}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition uppercase bg-white px-3 py-1.5 rounded-lg shadow-sm shrink-0 border border-amber-100"
            >
              Configure Now <ArrowRight size={14} />
            </button>
          </div>
        )}

        {showAlert && isPowerOverLimit && deviceInfo.is_online && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-red-100/80 border border-red-200 text-red-700 px-4 md:px-6 py-4 rounded-xl mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 text-white p-1.5 rounded-lg shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base">Alert: Power Limit Exceeded</h4>
                <p className="text-xs md:text-sm opacity-90">
                  Current usage ({metrics.daya_watt} watts) has reached the limit (
                  {userLimits.batas_daya_watt} W)
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-xs font-bold tracking-wider hover:opacity-70 transition uppercase self-end md:self-center"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          {[
            { label: "Current", val: Number(metrics.arus_ampere || 0).toFixed(2), unit: "A" },
            {
              label: "Power",
              val: Number(metrics.daya_watt || 0).toLocaleString("id-ID"),
              unit: "W",
            },
            { label: "Voltage", val: Number(metrics.tegangan_volt || 0).toFixed(0), unit: "V" },
            { label: "Energy", val: Number(metrics.energi_kwh || 0).toFixed(2), unit: "kWh" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-50"
            >
              <p className="text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                {item.label}
              </p>
              <h3 className="text-xl md:text-3xl font-bold text-gray-900">
                {item.val}
                <span className="text-sm md:text-lg text-gray-500"> {item.unit}</span>
              </h3>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1 bg-blue-100 p-4 md:p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-center">
            <p className="text-[10px] md:text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">
              Today&apos;s Cost
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-blue-900">
              Rp {Number(metrics.estimasi_biaya || 0).toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center h-56 md:h-64">
              <div className="w-full flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800">
                    {deviceInfo.nama_perangkat}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    ID: {deviceInfo.kode_device}
                  </p>
                </div>

                {/* Perbaikan UI Device Online/Offline Dinamis */}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border self-end ${deviceInfo.is_online ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-200"}`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${deviceInfo.is_online ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-700 leading-tight">
                      {deviceInfo.is_online ? "Device Online" : "Device Offline"}
                    </span>
                    <span className="text-[9px] text-gray-500 leading-tight">
                      Active: {deviceInfo.last_seen}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!deviceInfo.is_online || isToggling}
                onClick={() => {
                  if (!userLimits.isConfigured) {
                    alert("Harap lakukan konfigurasi VA terlebih dahulu di halaman Settings!");
                    return;
                  }
                  handleToggleRelay();
                }}
                className={`w-20 md:w-24 h-10 md:h-12 rounded-full flex items-center transition-all duration-300 px-1 
                  ${
                    !deviceInfo.is_online
                      ? "bg-gray-200 cursor-not-allowed justify-start opacity-50"
                      : deviceInfo.status_relay
                        ? "bg-blue-600 justify-end shadow-md shadow-blue-100"
                        : "bg-gray-300 justify-start"
                  }`}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Zap
                    size={18}
                    className={
                      !deviceInfo.is_online
                        ? "text-gray-300"
                        : deviceInfo.status_relay
                          ? "text-blue-600"
                          : "text-gray-400"
                    }
                    fill={deviceInfo.is_online && deviceInfo.status_relay ? "currentColor" : "none"}
                  />
                </div>
              </button>

              {/* Perbaikan Teks Menjadi 1 Baris dengan whitespace-nowrap */}
              <p
                className={`mt-6 font-bold tracking-wider text-[9px] sm:text-[10px] md:text-xs whitespace-nowrap uppercase ${!userLimits.isConfigured ? "text-amber-600" : deviceInfo.status_relay ? "text-blue-600" : "text-gray-500"}`}
              >
                {!userLimits.isConfigured
                  ? "SYSTEM: CONFIGURATION REQUIRED"
                  : `SYSTEM: POWER ${deviceInfo.status_relay ? "ON" : "OFF"}`}
              </p>
            </div>

            <div className="bg-gray-100/50 p-6 rounded-3xl border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-600 tracking-wider uppercase">
                  Settings & Limits {userLimits.daya_va > 0 && `(${userLimits.daya_va} VA)`}
                </h3>
                <button
                  onClick={() => router.push("/settings")}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Max Watt</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {userLimits.isConfigured
                        ? `${userLimits.batas_daya_watt.toLocaleString("id-ID")} W`
                        : "Not Set"}
                    </p>
                  </div>
                  <Gauge className="text-gray-300" size={20} />
                </div>
                <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Cost Limit</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {userLimits.isConfigured
                        ? `Rp ${userLimits.batas_biaya.toLocaleString("id-ID")}`
                        : "Not Set"}
                    </p>
                  </div>
                  <Wallet className="text-gray-300" size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col order-1 lg:order-2">
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Energy Usage Trend</h3>
                <p className="text-xs text-gray-500 mt-1">Real-time monitoring</p>
              </div>
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] md:text-sm font-bold uppercase">
                Today
              </div>
            </div>
            <div className="flex-1 w-full min-h-[250px] md:min-h-[300px]">
              {dataTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataTrend} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      dy={10}
                      interval="preserveStartEnd"
                      minTickGap={30}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      tickFormatter={(value) => `${value} kWh`}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }}
                      labelFormatter={(value) => `Time: ${value} WIB`}
                    />
                    <Line
                      type="monotone"
                      dataKey="kwh"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  No data trend found for today.
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </>
  );
}
