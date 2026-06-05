"use client";

import { useEffect, useState } from "react";
import { Bell, User, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

type HeaderProps = {
  title: string;
  onMenuClick: () => void;
  onNotificationClick: () => void;
};

const API_URL = "http://localhost:8000/api";

export default function Header({ title, onMenuClick, onNotificationClick }: HeaderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });

    async function getInitialNotifCount() {
      try {
        const res = await fetch(`${API_URL}/notifications`, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setNotifCount(data.length);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    }

    getInitialNotifCount();

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const notifInterval = setInterval(() => {
      getInitialNotifCount();
    }, 300000);

    return () => {
      clearInterval(timer);
      clearInterval(notifInterval);
    };
  }, []);

  useEffect(() => {
    async function refreshNotifCount() {
      try {
        const res = await fetch(`${API_URL}/notifications`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifCount(data.length);
        }
      } catch (error) {
        console.error("Failed to refresh notification count:", error);
      }
    }

    refreshNotifCount();
  }, [onNotificationClick]);

  const formatDateTime = (date: Date) => {
    if (!mounted) return "TIME: LOADING...";

    const day = date.getDate();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `TIME: ${day} ${month} ${year} | ${hours}:${minutes} WIB`;
  };

  return (
    <header className="flex items-center justify-between bg-white px-4 md:px-8 py-5 border-b border-gray-100 sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg transition"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-lg md:text-2xl font-bold text-blue-900 truncate">{title}</h2>
      </div>

      <div className="hidden lg:block">
        <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-500 tracking-wider whitespace-nowrap">
          {formatDateTime(time)}
        </div>
      </div>

      <div className="flex-1 flex justify-end items-center gap-3 md:gap-6">
        <button
          onClick={onNotificationClick}
          className="text-gray-400 hover:text-blue-600 transition relative p-1"
        >
          <Bell className="w-5 h-5 md:w-6 md:h-6" />

          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>

        <button
          onClick={() => router.push("/profile")}
          className="text-gray-400 hover:text-blue-600 transition"
        >
          <User className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </header>
  );
}
