"use client";

import LogoBlue from "@/components/LogoBlue";
import Link from "next/link"; // Tambahkan import Link
import { Mail, ChevronLeft } from "lucide-react"; // Tambahkan ChevronLeft
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/verify-otp");
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-white via-blue-50 to-blue-200 p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* LOGO + TEXT */}
        <div className="flex flex-col items-center mb-6">
          <LogoBlue />

          <h1 className="text-blue-600 font-bold text-xl mt-3">
            VoltCore
          </h1>

          <p className="text-xs tracking-widest text-gray-500">
            POWER INTELLIGENCE
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Don’t worry. Enter your email address and we will send you recovery instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="example@gmail.com"
              className="w-full p-4 pr-10 rounded-xl bg-gray-100 text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <Mail className="absolute right-3 top-[42px] text-gray-400" size={18}/>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold 
            hover:bg-blue-700 transition shadow-md active:scale-[0.98]"
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