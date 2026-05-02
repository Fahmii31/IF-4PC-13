"use client";

import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    History as HistoryIcon,
    Settings,
    LogOut,
    Bell,
    User,
    ShieldCheck,
    RefreshCcw
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoBlue from "@/components/LogoBlue";
import Notifications from "@/components/Notifications"; // IMPORT: Komponen Notifikasi

export default function ProfilePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState(new Date());

    // State untuk Personal Information
    const [username, setUsername] = useState("Fahmi");
    const [email, setEmail] = useState("fahmi@example.com");
    const [phone, setPhone] = useState("08********");

    // State untuk Security
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State untuk Notifikasi
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // STATE: Modal

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDateTime = (date: Date) => {
        if (!mounted) return "TIME: LOADING...";
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `TIME: ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} | ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} WIB`;
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-gray-900 font-sans">

            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-screen sticky top-0">
  
                {/* Bagian Navigasi: flex-1 dan overflow-y-auto agar konsisten */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 p-6 mb-4">
                        <LogoBlue />
                        <div>
                            <h1 className="text-blue-600 font-bold text-xl leading-none">VoltCore</h1>
                            <p className="text-[10px] tracking-widest text-gray-500 mt-1 uppercase">Power Intelligence</p>
                        </div>
                    </div>

                    <nav className="px-4 space-y-2">
                        <button 
                            onClick={() => router.push("/dashboard")} 
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left"
                        >
                            <LayoutDashboard size={20} /> DASHBOARD
                        </button>

                        <button 
                            onClick={() => router.push("/history")} 
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left"
                        >
                            <HistoryIcon size={20} /> HISTORY
                        </button>

                        <button 
                            onClick={() => router.push("/settings")} 
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition text-left"
                        >
                            <Settings size={20} /> SETTINGS
                        </button>
                    </nav>
                </div>

                {/* Bagian Bawah: Logout dengan Border Atas sesuai standar halaman lain */}
                <div className="p-4 border-t border-gray-50 bg-white">
                    <button 
                        onClick={() => router.push("/login")} 
                        className="flex items-center justify-center gap-2 w-full py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 font-medium transition"
                    >
                        <LogOut size={18} /> LOGOUT
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* HEADER */}
                <header className="flex items-center justify-between bg-white px-8 py-5 border-b border-gray-100 relative">
                    <div className="flex-1 text-2xl font-bold text-blue-900 tracking-tight">Profile</div>
                    <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block px-4 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-500 tracking-wider uppercase">
                        {formatDateTime(time)}
                    </div>
                    <div className="flex-1 flex justify-end items-center gap-6">
                        {/* TRIGGER NOTIFIKASI */}
                        <button 
                            onClick={() => setIsNotificationOpen(true)}
                            className="text-gray-400 hover:text-gray-600 transition relative"
                        >
                            <Bell size={24} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="p-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100"><User size={24} /></button>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-auto space-y-10 custom-scrollbar">

                    {/* PERSONAL INFORMATION SECTION */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50">
                            <div className="grid grid-cols-1 gap-6 max-w-4xl">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 font-medium text-gray-700 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 font-medium text-gray-700 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Contoh: 0853..."
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 font-medium text-gray-700 transition-all"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95 text-xs uppercase tracking-widest">
                                        Update Information
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECURITY SECTION */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-gray-800">Security</h3>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Deskripsi */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                                        <ShieldCheck size={24} />
                                        <h4 className="font-bold text-gray-800">Update Password</h4>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                                        Ensure your account stays protected by regularly updating your password with a strong combination.
                                    </p>
                                </div>

                                {/* Form Password */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••••••"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 font-medium text-gray-700 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Min. 8 characters"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 font-medium text-gray-700 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 font-medium text-gray-700 transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/10 active:scale-95 text-xs uppercase tracking-widest">
                                            <RefreshCcw size={16} /> Change Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            {/* KOMPONEN NOTIFIKASI */}
            <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
            `}</style>
        </div>
    );
}