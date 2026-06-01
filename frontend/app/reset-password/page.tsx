"use client";

import LogoBlue from "@/components/LogoBlue";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/otp-session", {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");

      setLoading(false);

      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number",
      );

      setLoading(false);

      return;
    }

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

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

        body: JSON.stringify({
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Reset password failed");

        return;
      }

      alert(data.message || "Password has been successfully updated");

      router.push("/login");
    } catch (err) {
      console.error(err);

      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen 
      flex items-center justify-center
      bg-gradient-to-br from-white via-blue-50 to-blue-200
      px-4 py-8 sm:px-6
    "
    >
      <div
        className="
        w-full max-w-md
        bg-white
        rounded-[2rem]
        shadow-2xl
        p-6 sm:p-8
      "
      >
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <LogoBlue />

          <h1 className="text-blue-600 font-bold text-xl mt-3">VoltCore</h1>

          <p className="text-[10px] sm:text-xs tracking-[0.25em] text-gray-500 text-center">
            POWER INTELLIGENCE
          </p>
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            New Password
          </h2>

          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Set your new password to regain access to your hub.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="
                w-full
                h-12 sm:h-14
                px-4 pr-12
                rounded-xl
                bg-gray-100
                text-gray-900
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
                text-sm sm:text-base
              "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-blue-600
                transition
              "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="
                w-full
                h-12 sm:h-14
                px-4 pr-12
                rounded-xl
                bg-gray-100
                text-gray-900
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
                text-sm sm:text-base
              "
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-blue-600
                transition
              "
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
              bg-red-50
              border border-red-200
              text-red-600
              text-sm
              px-4 py-3
              rounded-xl
            "
            >
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-14 bg-blue-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-[0.98] mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "CONFIRM"}
          </button>
        </form>
      </div>
    </div>
  );
}
