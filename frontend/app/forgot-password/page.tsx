"use client";

import LogoBlue from "@/components/LogoBlue";
import Link from "next/link";
import { Mail, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const token = Cookies.get("XSRF-TOKEN");
      const res = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(token || ""),
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          toast.error(Object.values(data.errors).flat().join(", "));
        } else {
          toast.error(data.message || "Something went wrong");
        }
        return;
      }

      toast.success(data.message || "OTP has been sent");

      setTimeout(() => {
        router.push("/verify-otp");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100/50 px-4 py-8 sm:p-6">
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        {/* LOGO + TEXT */}
        <div className="flex flex-col items-center mb-8">
          <LogoBlue />
          <h1 className="text-blue-600 font-bold text-lg mt-3 tracking-wide">VoltCore</h1>
          <p className="text-[10px] tracking-[0.2em] text-gray-400 mt-0.5">POWER INTELLIGENCE</p>
        </div>

        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1.5">Forgot Password</h2>
          <p className="text-xs text-gray-500 leading-relaxed px-2">
            Enter your email address and we will send you recovery instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
            />
            <Mail className="absolute right-4 top-[34px] text-gray-400" size={16} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white text-sm py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </form>

        {/* TOMBOL KEMBALI KE LOGIN */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            <ChevronLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
