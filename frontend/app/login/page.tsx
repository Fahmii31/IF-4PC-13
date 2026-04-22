"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
// REVISI: Lock dihapus dari import karena tidak digunakan di dalam kode bawah
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Sign in to your account
        </h2>

        <p className="text-gray-500 text-center mb-8">
          Log in to your power intelligence hub.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USERNAME */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600">Username</label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full p-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <User size={18} className="absolute right-3 top-4 text-gray-400" />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600">Password</label>
              {/* FIX: size={18} TELAH DIHAPUS dari Link di bawah ini */}
              <Link href="/forgot-password" className="text-blue-600 text-xs font-semibold hover:underline">
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
                className="w-full p-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" />
              <span className="text-gray-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-md active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}