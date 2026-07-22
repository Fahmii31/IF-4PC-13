"use client";

import LogoBlue from "@/components/LogoBlue";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const canResend = timer <= 0;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/reset-session", {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.valid) router.push("/forgot-password");
      } catch {
        router.push("/forgot-password");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (timer <= 0) return;
    const timeoutId = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(timeoutId);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(59);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" });
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
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to resend OTP");
        return;
      }
      toast.success(data.message || "OTP has been resent");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" });
      const token = Cookies.get("XSRF-TOKEN");
      const res = await fetch("http://localhost:8000/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(token || ""),
        },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      toast.success(data.message || "OTP successfully verified");
      setOtp("");
      router.push("/reset-password");
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100/50 p-6">
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <LogoBlue />
          <h1 className="text-blue-600 font-bold text-lg mt-3 tracking-wide">VoltCore</h1>
          <p className="text-[10px] tracking-[0.2em] text-gray-400 mt-0.5">POWER INTELLIGENCE</p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1.5">Verify Email</h2>
          <p className="text-xs text-gray-500 leading-relaxed px-2">
            Enter the 6-digit code we sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative flex justify-center items-center">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
              autoFocus
            />
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`w-10 h-12 flex items-center justify-center text-lg font-semibold rounded-xl border transition-all duration-200 
                  ${
                    otp.length === index
                      ? "border-blue-500 bg-white ring-4 ring-blue-500/10 shadow-sm"
                      : "border-gray-200 bg-gray-50"
                  }
                  ${
                    otp.length > index
                      ? "text-gray-800 border-gray-300 bg-white"
                      : "text-transparent"
                  }`}
                >
                  {otp[index] || "•"}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="w-full bg-blue-600 text-white text-sm py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Confirm Code"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-700 transition-colors text-xs"
            >
              <RefreshCw size={14} />
              Resend Code
            </button>
          ) : (
            <p className="text-gray-400 text-xs font-medium">
              Resend code in{" "}
              <span className="font-mono text-blue-500">0:{timer < 10 ? `0${timer}` : timer}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
