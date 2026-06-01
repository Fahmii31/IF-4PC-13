"use client";

import LogoBlue from "@/components/LogoBlue";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canResend = timer <= 0;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/reset-session", {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.valid) {
          router.push("/forgot-password");
        }
      } catch {
        router.push("/forgot-password");
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (timer <= 0) return;

    const timeoutId = setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;

    setError("");

    setTimer(59);

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

        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");

        return;
      }

      alert(data.message || "OTP has been resent");
    } catch (err) {
      console.error(err);

      setError("Failed to resend OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

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

        body: JSON.stringify({
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");

        return;
      }

      alert(data.message || "OTP successfully verified");

      setOtp("");

      router.push("/reset-password");
    } catch (err) {
      console.error(err);

      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-200 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <LogoBlue />
          <h1 className="text-blue-600 font-bold text-lg sm:text-xl mt-3">
            VoltCore
          </h1>
          <p className="text-xs tracking-widest text-gray-500">
            POWER INTELLIGENCE
          </p>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-900 mb-2">
          Verify Email
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Enter the 6-digit code we sent to your email.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

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
            <div className="flex gap-2 sm:gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-lg sm:text-xl font-bold rounded-xl border-2 transition-all 
                  ${otp.length === index ? "border-blue-500 bg-white ring-2 ring-blue-100" : "border-transparent bg-gray-100"}
                  ${otp.length > index ? "text-gray-900" : "text-transparent"}`}
                >
                  {otp[index] || "•"}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "CONFIRM"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm"
            >
              <RefreshCw size={16} />
              Resend Code
            </button>
          ) : (
            <p className="text-gray-400 text-sm">
              Resend code in{" "}
              <span className="font-mono text-blue-500">
                0:{timer < 10 ? `0${timer}` : timer}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
