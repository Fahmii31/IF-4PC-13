"use client";

import React, { useState, useEffect, useMemo } from "react";

import {
  AlertTriangle,
  Zap,
  Gauge,
  Wallet,
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

import Notifications from "@/components/Notifications";
import MainLayout from "@/components/layout/MainLayout";

type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
};

export default function DashboardPage() {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [showAlert, setShowAlert] = useState(true);
  const [powerOn, setPowerOn] = useState(true);

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

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  return (
    <>
      <MainLayout
        title="Dashboard Overview"
        user={user}
        onLogout={handleLogout}
        onNotificationClick={() => setIsNotificationOpen(true)}
      >

        {/* ALERT BANNER */}
        {showAlert && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-red-100/80 border border-red-200 text-red-700 px-4 md:px-6 py-4 rounded-xl mb-6 gap-4">

            <div className="flex items-center gap-4">

              <div className="bg-red-500 text-white p-1.5 rounded-lg shrink-0">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h4 className="font-bold text-sm md:text-base">
                  Alert: Power Is Over
                </h4>

                <p className="text-xs md:text-sm opacity-90">
                  Current usage (30 watts) has reached the limit
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

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">

          {[
            { label: "Current", val: "12.4", unit: "A" },
            { label: "Power", val: "2,840", unit: "W" },
            { label: "Voltage", val: "231", unit: "V" },
            { label: "Energy", val: "18.2", unit: "kWh" },
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

                <span className="text-sm md:text-lg text-gray-500">
                  {" "}
                  {item.unit}
                </span>
              </h3>

            </div>

          ))}

          <div className="col-span-2 sm:col-span-1 bg-blue-100 p-4 md:p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-center">

            <p className="text-[10px] md:text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">
              Today&apos;s Cost
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-blue-900">
              Rp 27,450
            </h3>

          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="space-y-6 order-2 lg:order-1">

            {/* POWER CONTROL */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center h-56 md:h-64">

              <h3 className="text-base md:text-lg font-bold text-gray-800 w-full text-left mb-6">
                Power Control
              </h3>

              <button
                onClick={() => setPowerOn(!powerOn)}
                className={`w-20 md:w-24 h-10 md:h-12 rounded-full flex items-center transition-colors duration-300 px-1 ${
                  powerOn
                    ? "bg-blue-600 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >

                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-md">

                  <Zap
                    size={18}
                    className={powerOn ? "text-blue-600" : "text-gray-400"}
                    fill={powerOn ? "currentColor" : "none"}
                  />

                </div>

              </button>

              <p
                className={`mt-6 font-bold tracking-wider text-[10px] md:text-sm ${
                  powerOn ? "text-blue-600" : "text-gray-500"
                }`}
              >
                SYSTEM: POWER {powerOn ? "ON" : "OFF"}
              </p>

            </div>

            {/* SETTINGS PREVIEW */}
            <div className="bg-gray-100/50 p-6 rounded-3xl border border-gray-100">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-xs font-bold text-gray-600 tracking-wider uppercase">
                  Settings & Limits
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
                    <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">
                      Max Watt
                    </p>

                    <p className="font-bold text-gray-900 text-sm">
                      1,200 W
                    </p>
                  </div>

                  <Gauge className="text-gray-300" size={20} />

                </div>

                <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">
                      Cost Limit
                    </p>

                    <p className="font-bold text-gray-900 text-sm">
                      Rp 750k
                    </p>
                  </div>

                  <Wallet className="text-gray-300" size={20} />

                </div>

              </div>

            </div>

          </div>

          {/* CHART */}
          <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col order-1 lg:order-2">

            <div className="flex justify-between items-start mb-6 md:mb-8">

              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Energy Usage Trend
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Real-time monitoring
                </p>
              </div>

              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] md:text-sm font-bold uppercase">
                Today
              </div>

            </div>

            <div className="flex-1 w-full min-h-[250px] md:min-h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <LineChart
                  data={dataTrend}
                  margin={{
                    top: 5,
                    right: 10,
                    bottom: 5,
                    left: -25
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    tickFormatter={(value) => `${value}k`}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "12px"
                    }}
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

            </div>

          </div>

        </div>

      </MainLayout>

      <Notifications
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}