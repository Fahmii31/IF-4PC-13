"use client";

import AuthLayout from "@/components/layout/AuthLayout";
import Link from "next/link";
import { User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getAuthUser } from "@/lib/auth";
import Image from "next/image";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Signing in...");

    try {
      const res = await loginUser({
        username: formData.username,
        password: formData.password,
        remember: remember,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed", { id: toastId });
        return;
      }

      const user = await getAuthUser();

      sessionStorage.setItem("auth_user", JSON.stringify(user));

      toast.success(data.message || "Welcome back!", { id: toastId });

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Cannot connect to server", { id: toastId });
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
              <label className="text-sm text-gray-600">Username</label>
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
              <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600">Password</label>
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
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
          </div>

          {/* ERROR BLOCK DIHAPUS - Digantikan oleh Toast */}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full h-12 sm:h-14 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-md active:scale-[0.98] mt-2"
          >
            Sign In
          </button>

          {/* LAYOUT POSITIONING: SEPARATOR DIVISION */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
              Or
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:8000/auth/google";
            }}
            className="w-full h-12 sm:h-14 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-3"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
