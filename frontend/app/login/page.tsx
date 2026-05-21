"use client";

import AuthLayout from "@/components/layout/AuthLayout";
import Link from "next/link";
import { User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // TAMBAHAN STATE REMEMBER ME
  const [remember, setRemember] = useState(false);

  // TAMBAHAN ERROR STATE
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          remember: remember,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // HANDLE VALIDATION (422)
        if (res.status === 422 && data.errors) {
          setError(Object.values(data.errors).flat().join(", "));
        } else {
          setError(data.message || "Login failed");
        }
        return;
      }

      console.log("LOGIN SUCCESS:", data);

      // SIMPAN TOKEN SESUAI REMEMBER
      if (remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Cannot connect to server");
    }
  };

  return (
  <AuthLayout>
    <div className="w-full max-w-md mx-auto px-1 sm:px-0">
      
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2 leading-tight">
        Sign in to your account
      </h2>

      <p className="text-sm sm:text-base text-gray-500 text-center mb-6 sm:mb-8">
        Log in to your power intelligence hub.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

        {/* USERNAME */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-gray-600">
              Username
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <User
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-gray-600">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-blue-600 text-xs font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* REMEMBER */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />

            <span className="text-gray-600">
              Remember me
            </span>
          </label>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full h-12 sm:h-14 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-md active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-6 sm:mt-8 text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </AuthLayout>
);
}