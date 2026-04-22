"use client";

import LogoBlue from "@/components/LogoBlue";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter(); // Inisialisasi router untuk navigasi
  
  // State untuk kontrol mata (show/hide password)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State untuk menyimpan input
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Pastikan "setFormData" ditulis dengan huruf F dan D besar agar tidak merah
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana: pastikan password sama
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Simulasi Berhasil
    console.log("Password updated!");

    // PINDAH KE HALAMAN LOGIN
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-white via-blue-50 to-blue-200 p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <LogoBlue />
          <h1 className="text-blue-600 font-bold text-xl mt-3">VoltCore</h1>
          <p className="text-xs tracking-widest text-gray-500">POWER INTELLIGENCE</p>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          New Password
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Set your new password to regain access to your hub.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* INPUT PASSWORD BARU */}
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-4 pr-12 rounded-xl bg-gray-100 text-gray-900 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

          {/* KONFIRMASI PASSWORD */}
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-4 pr-12 rounded-xl bg-gray-100 text-gray-900 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold 
            hover:bg-blue-700 transition shadow-md active:scale-[0.98] mt-4"
          >
            CONFIRM
          </button>
        </form>

      </div>
    </div>
  );
}