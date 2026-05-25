"use client";

import React, { useState, useEffect } from "react";

import {
  ShieldCheck,
  User as UserIcon,
  Edit3,
  X,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";

export default function ProfilePage() {

  const router = useRouter();

  // AUTH
  const { user, loading } = useAuth();

  const [isNotificationOpen, setIsNotificationOpen] =
    useState(false);

  // Toggle Edit Modes
  const [isEditProfile, setIsEditProfile] =
    useState(false);

  const [isEditPassword, setIsEditPassword] =
    useState(false);

  // Show/Hide Password State
  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  // States
  const [formData, setFormData] = useState({
    username: "",
    phone: ""
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [, setSubmitLoading] =
    useState(false);

 useEffect(() => {

  if (user) {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      username: user.username,
      phone: user.phone
    });
  }

}, [user]);

  // UPDATE PROFILE
  const handleUpdateProfile = async () => {

    setSubmitLoading(true);

    try {

      // CSRF COOKIE
      await fetch(
        "http://localhost:8000/sanctum/csrf-cookie",
        {
          credentials: "include"
        }
      );

      // XSRF TOKEN
      const xsrfToken = decodeURIComponent(
        document.cookie
          .split("; ")
          .find((row) =>
            row.startsWith("XSRF-TOKEN=")
          )
          ?.split("=")[1] || ""
      );

      const res = await fetch(
        "http://localhost:8000/api/update-profile",
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken
          },

          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      if (res.ok) {

        setIsEditProfile(false);

        alert(data.message);

        window.location.reload();

      } else {

        alert(data.message);
      }

    } catch {

      alert("Connection Error");

    } finally {

      setSubmitLoading(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {

    if (passwords.new !== passwords.confirm) {

      return alert("Passwords do not match!");
    }

    setSubmitLoading(true);

    try {

      // CSRF COOKIE
      await fetch(
        "http://localhost:8000/sanctum/csrf-cookie",
        {
          credentials: "include"
        }
      );

      // XSRF TOKEN
      const xsrfToken = decodeURIComponent(
        document.cookie
          .split("; ")
          .find((row) =>
            row.startsWith("XSRF-TOKEN=")
          )
          ?.split("=")[1] || ""
      );

      const res = await fetch(
        "http://localhost:8000/api/change-password",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken
          },

          body: JSON.stringify({
            current_password: passwords.current,
            new_password: passwords.new
          })
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert(
          "Success! Please login with your new password."
        );

        await logoutUser();

        router.replace("/login");

      } else {

        alert(data.message);
      }

    } catch {

      alert("Error changing password");

    } finally {

      setSubmitLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = async () => {

    await logoutUser();

    router.replace("/login");
  };

    return (
        <MainLayout
            title="My Profile"
            user={user}
            onLogout={handleLogout} // Menambahkan onLogout yang hilang
            onNotificationClick={() => setIsNotificationOpen(true)}
        >
            <div className="p-8 max-w-5xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <UserIcon size={48} />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{user?.username || "Loading..."}</h2>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                    {!isEditProfile && (
                        <button
                            onClick={() => setIsEditProfile(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition font-semibold text-sm"
                        >
                            <Edit3 size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Info Card */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Personal Details</h3>
                            {isEditProfile && (
                                <button onClick={() => setIsEditProfile(false)} className="text-red-500"><X size={18} /></button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Username</label>
                                <input
                                    disabled={!isEditProfile}
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={`w-full p-4 rounded-xl border transition-all font-medium ${isEditProfile ? 'bg-white border-blue-200' : 'bg-gray-50 border-transparent'}`}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Email (Fixed)</label>
                                <input disabled value={user?.email || ""} className="w-full p-4 rounded-xl border border-transparent bg-gray-50 text-gray-400 font-medium cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">WhatsApp</label>
                                <input
                                    disabled={!isEditProfile}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full p-4 rounded-xl border transition-all font-medium ${isEditProfile ? 'bg-white border-blue-200' : 'bg-gray-50 border-transparent'}`}
                                />
                            </div>
                        </div>

                        {isEditProfile && (
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                            </button>
                        )}
                    </div>

                    {/* Security Card */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Account Security</h3>
                            {!isEditPassword ? (
                                <button onClick={() => setIsEditPassword(true)} className="text-blue-600 text-xs font-bold uppercase hover:underline">Change</button>
                            ) : (
                                <button onClick={() => setIsEditPassword(false)} className="text-red-500"><X size={18} /></button>
                            )}
                        </div>

                        {!isEditPassword ? (
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <ShieldCheck className="text-blue-600" size={32} />
                                <div>
                                    <p className="text-sm font-bold text-blue-900">Password is set</p>
                                    <p className="text-[10px] text-blue-500">Regularly update your password</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        placeholder="Current Password"
                                        className="w-full p-4 bg-gray-50 border border-blue-100 rounded-xl outline-none focus:bg-white"
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    />
                                    <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-4 text-gray-400">
                                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        placeholder="New Password"
                                        className="w-full p-4 bg-gray-50 border border-blue-100 rounded-xl outline-none focus:bg-white"
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                    <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-4 text-gray-400">
                                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <input
                                    type="password" placeholder="Confirm New Password"
                                    className="w-full p-4 bg-gray-50 border border-blue-100 rounded-xl outline-none focus:bg-white"
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
                                >
                                    {loading ? "Processing..." : "Confirm"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        </MainLayout>
    );
}