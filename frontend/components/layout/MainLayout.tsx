"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Overlay from "@/components/overlay/Overlay";

type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
};

type MainLayoutProps = {
  children: ReactNode;
  title: string;
  user: User | null;
  onLogout: () => void;
  onNotificationClick: () => void;
};

export default function MainLayout({
  children,
  title,
  user,
  onLogout,
  onNotificationClick,
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    /* HAPUS NOTIFICATION PROVIDER DI SINI */
    <div className="flex h-screen bg-slate-50 text-gray-900 font-sans overflow-hidden">
      {/* OVERLAY */}
      <Overlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <Header
          title={title}
          onMenuClick={() => setIsSidebarOpen(true)}
          onNotificationClick={onNotificationClick}
        />

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
