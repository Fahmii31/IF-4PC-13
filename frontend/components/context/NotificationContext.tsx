"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000/api";

export interface AlertItem {
  notif_id: number;
  jenis_notif: string;
  pesan: string;
  created_at: string;
}

interface NotificationContextType {
  alerts: AlertItem[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  clearAllAlerts: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. PERBAIKAN: Gunakan useCallback agar fungsi memiliki referensi memori yang stabil
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data notifikasi:", error);
    }
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      fetchNotifications();
    }, 0);

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  const clearAllAlerts = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(Cookies.get("XSRF-TOKEN") || ""),
        },
        credentials: "include",
      });

      if (res.ok) {
        setAlerts([]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal menghapus alert:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotificationContext.Provider value={{ alerts, loading, fetchNotifications, clearAllAlerts }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
