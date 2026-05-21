"use client";

import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import LogoBlue from "@/components/LogoBlue";

type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
};

type SidebarProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function Sidebar({
  user,
  isOpen,
  onClose,
  onLogout,
}: SidebarProps) {

  const router = useRouter();
  const pathname = usePathname();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/history")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsHistoryOpen(true);
    }
  }, [pathname]);

  const isDashboard = pathname === "/dashboard";
  const isSettings = pathname === "/settings";

  const isHistory =
    pathname === "/history" ||
    pathname === "/history/monthly" ||
    pathname === "/history/yearly";

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col h-screen
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:flex-shrink-0
      `}
    >

      <div className="flex-1 overflow-y-auto">

        <div className="flex items-center justify-between p-6 mb-4">

          <div className="flex items-center gap-3">
            <LogoBlue />

            <div>
              <h1 className="text-blue-600 font-bold text-xl leading-none">
                VoltCore
              </h1>

              <p className="text-[10px] tracking-widest text-gray-500 mt-1 uppercase">
                Power Intelligence
              </p>
            </div>
          </div>

          <button
            className="md:hidden text-gray-400"
            onClick={onClose}
          >
            <X size={24} />
          </button>

        </div>

        {user && (
          <div className="px-4 mb-6">
            {/* Tambahkan onClick disini */}
            <div
              onClick={() => router.push("/profile")}
              className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all cursor-pointer group"
            >
              {/* Avatar Section - Memberikan kesan aplikasi premium */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                {/* Status Online Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate tracking-tight">
                  {user?.username || "Loading..."}
                </p>
                <p className="text-[10px] text-gray-500 truncate font-medium">
                  {user?.email || ""}
                </p>
              </div>

              {/* Optional: Icon tambahan seperti Log Out kecil atau Settings */}
              <div className="text-gray-300 group-hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <nav className="px-4 space-y-2">

          {/* DASHBOARD */}
          <button
            onClick={() => {
              router.push("/dashboard");
              onClose();
            }}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-xl transition text-left
              ${isDashboard
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50 font-medium"}
            `}
          >
            <LayoutDashboard size={20} />
            DASHBOARD
          </button>

          {/* HISTORY */}
          <div className="space-y-1">

            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`
                flex items-center justify-between w-full px-4 py-3 rounded-xl transition text-left
                ${isHistory
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 font-medium"}
              `}
            >

              <div className="flex items-center gap-3">
                <History size={20} />
                HISTORY
              </div>

              {isHistoryOpen
                ? <ChevronDown size={16} />
                : <ChevronRight size={16} />
              }

            </button>

            {isHistoryOpen && (
              <div className="ml-9 space-y-1 pr-2">

                <button
                  onClick={() => {
                    router.push("/history");
                    onClose();
                  }}
                  className={`
                    w-full px-4 py-2 rounded-lg text-sm text-left transition
                    ${pathname === "/history"
                      ? "bg-blue-100/50 text-blue-600 font-bold"
                      : "text-gray-400 hover:text-blue-600 hover:bg-gray-50 font-medium"}
                  `}
                >
                  Consumption
                </button>

                <button
                  onClick={() => {
                    router.push("/history/monthly");
                    onClose();
                  }}
                  className={`
                    w-full px-4 py-2 rounded-lg text-sm text-left transition
                    ${pathname === "/history/monthly"
                      ? "bg-blue-100/50 text-blue-600 font-bold"
                      : "text-gray-400 hover:text-blue-600 hover:bg-gray-50 font-medium"}
                  `}
                >
                  Monthly Report
                </button>

                <button
                  onClick={() => {
                    router.push("/history/yearly");
                    onClose();
                  }}
                  className={`
                    w-full px-4 py-2 rounded-lg text-sm text-left transition
                    ${pathname === "/history/yearly"
                      ? "bg-blue-100/50 text-blue-600 font-bold"
                      : "text-gray-400 hover:text-blue-600 hover:bg-gray-50 font-medium"}
                  `}
                >
                  Yearly Report
                </button>

              </div>
            )}

          </div>

          {/* SETTINGS */}
          <button
            onClick={() => {
              router.push("/settings");
              onClose();
            }}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-xl transition text-left
              ${isSettings
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50 font-medium"}
            `}
          >
            <Settings size={20} />
            SETTINGS
          </button>

        </nav>
      </div>

      <div className="p-4 border-t border-gray-50">

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 font-medium transition"
        >
          <LogOut size={18} />
          LOGOUT
        </button>

      </div>

    </aside>
  );
}