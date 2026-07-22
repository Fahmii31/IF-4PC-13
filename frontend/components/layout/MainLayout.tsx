"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, Loader2 } from "lucide-react";

import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Overlay from "@/components/overlay/Overlay";
import { logoutUser } from "@/lib/logout";

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
  onNotificationClick: () => void;
};

export default function MainLayout({
  children,
  title,
  user,
  onNotificationClick,
}: MainLayoutProps) {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading("Logging out...");

    try {
      const res = await logoutUser();
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Logout failed. Please try again.", { id: toastId });
        setIsLoggingOut(false);
        setIsLogoutModalOpen(false);
        return;
      }

      sessionStorage.removeItem("auth_user");
      toast.success(data.message || "Logged out successfully 👋", { id: toastId });

      setIsLogoutModalOpen(false);
      router.replace("/login");
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.", { id: toastId });
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-gray-900 font-sans overflow-hidden relative">
      {/* OVERLAY SIDEBAR MOBILE */}
      <Overlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title={title}
          onMenuClick={() => setIsSidebarOpen(true)}
          onNotificationClick={onNotificationClick}
        />

        <div className="p-4 md:p-8 flex-1">{children}</div>
      </main>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center transform transition-all animate-in zoom-in-95 duration-200">
            {/* ICON BADGE */}
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
              <LogOut size={26} className="ml-0.5" />
            </div>

            {/* HEADER TEXT */}
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Sign Out Confirmation
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to sign out of{" "}
              <span className="font-semibold text-blue-600">VoltCore</span>?
            </p>

            {/* BUTTON ACTION */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleConfirmLogout}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <span>Yes, Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
