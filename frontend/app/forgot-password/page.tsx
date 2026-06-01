"use client";

import LogoBlue from "@/components/LogoBlue";
import Link from "next/link";
import { Mail, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // AMBIL CSRF COOKIE
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      // AMBIL TOKEN DARI COOKIE
      const token = Cookies.get("XSRF-TOKEN");
      // REQUEST
      const res = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(token || ""),
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          setError(Object.values(data.errors).flat().join(", "));
        } else {
          setError(data.message || "Something went wrong");
        }
        return;
      }

      setSuccess(data.message || "OTP has been sent");

      setTimeout(() => {
        router.push("/verify-otp");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-200 px-4 py-8 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8">
        {/* LOGO + TEXT */}
        <div className="flex flex-col items-center mb-6">
          <LogoBlue />

          <h1 className="text-blue-600 font-bold text-xl mt-3">VoltCore</h1>

          <p className="text-xs tracking-widest text-gray-500">
            POWER INTELLIGENCE
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Don’t worry. Enter your email address and we will send you recovery
          instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // reset error saat ngetik
                setSuccess("");
              }}
              placeholder="example@gmail.com"
              className={`w-full p-4 pr-10 rounded-xl bg-gray-100 text-gray-900 
              focus:outline-none focus:ring-2 transition
              ${error ? "ring-2 ring-yellow-400" : "focus:ring-blue-500"}`}
            />

            <Mail
              className="absolute right-3 top-[42px] text-gray-400"
              size={18}
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-4 py-2 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold 
            hover:bg-blue-700 transition shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            CONFIRM
          </button>
        </form>

        {/* TOMBOL KEMBALI KE LOGIN */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition font-medium"
          >
            <ChevronLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
