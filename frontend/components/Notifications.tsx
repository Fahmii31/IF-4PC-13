"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface NotificationItem {
  notif_id: number;
  jenis_notif: string;
  pesan: string;
  created_at: string;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = "http://localhost:8000/api";

export default function Notifications({ isOpen, onClose }: NotificationsProps) {
  const [alerts, setAlerts] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchNotifications(showLoading = false) {
      try {
        if (showLoading && isMounted) setLoading(true);
        const res = await fetch(`${API_URL}/notifications`, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) setAlerts(data);
        }
      } catch (error) {
        console.error("Failed to fetch system alerts:", error);
      } finally {
        if (showLoading && isMounted) setLoading(false);
      }
    }

    if (isOpen) {
      fetchNotifications(true);

      const interval = setInterval(() => {
        fetchNotifications(false);
      }, 300000);

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  const handleClearAll = async () => {
    const confirmClear = window.confirm("Are you sure you want to dismiss all active alerts?");
    if (!confirmClear) return;

    try {
      setLoading(true);
      const token = Cookies.get("XSRF-TOKEN");
      const res = await fetch(`${API_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(token || ""),
        },
        credentials: "include",
      });

      if (res.ok) {
        setAlerts([]);
      } else {
        alert("Failed to clear system alerts.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-[440px] rounded-[28px] shadow-2xl overflow-hidden">
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
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 p-1">
            <X size={24} />
          </button>
        </div>

        {/* ALERT LIST */}
        <div className="px-6 py-4 space-y-3 min-h-[180px] max-h-[350px] overflow-y-auto flex flex-col justify-center">
          {loading && alerts.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.notif_id}
                className="flex items-center justify-between p-5 bg-red-50/30 border border-red-100/40 rounded-[20px]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-red-500 text-red-500 rounded-full shrink-0">
                    <span className="font-black text-[10px]">!</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-wider mb-0.5">
                      {alert.jenis_notif}
                    </p>
                    <h4 className="font-bold text-gray-800 text-[13px] leading-tight">
                      {alert.pesan}
                    </h4>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-300 tabular-nums shrink-0 ml-2">
                  {new Date(alert.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 my-auto">
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
            disabled={alerts.length === 0 || loading}
            className={`w-full py-4 border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
              alerts.length === 0
                ? "text-gray-200 cursor-not-allowed bg-gray-50/50"
                : "text-gray-400 hover:bg-gray-50 hover:text-red-500"
            }`}
          >
            {loading ? "Processing..." : "Clear All Alerts"}
          </button>
        </div>
      </div>
    </div>
  );
}
