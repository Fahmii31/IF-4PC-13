"use client";

import LogoBlue from "@/components/LogoBlue";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/otp-session", {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number"
      );
      setLoading(false);
      return;
    }

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" });
      const token = Cookies.get("XSRF-TOKEN");
      const res = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(token || ""),
        },
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Reset password failed");
        return;
      }

      toast.success(data.message || "Password updated successfully");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100/50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <LogoBlue />
          <h1 className="text-blue-600 font-bold text-lg mt-3 tracking-wide">VoltCore</h1>
          <p className="text-[10px] tracking-[0.2em] text-gray-400 mt-0.5">POWER INTELLIGENCE</p>
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-1.5">New Password</h2>
          <p className="text-xs text-gray-500 leading-relaxed px-2">
            Set your new password to regain access to your hub.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PASSWORD */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white text-sm py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] mt-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
