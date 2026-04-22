"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { User, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    whatsapp: "",
  });

  // State untuk menyimpan pesan error inline
  const [errors, setErrors] = useState({
    email: "",
    confirmPassword: "",
  });

  // State untuk toggle hide/show password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle perubahan input text
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") setErrors((prev) => ({ ...prev, email: "" }));
    if (name === "confirmPassword" || name === "password") {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = { email: "", confirmPassword: "" };

    if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
      newErrors.email = "Email wajib menggunakan @gmail.com";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    console.log("Registrasi Berhasil:", formData);

    router.push("/login");
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Create your account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Join and start monitoring your energy usage
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Username</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 rounded-lg bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 pr-10 rounded-lg bg-gray-100 text-gray-900 focus:ring-2 outline-none transition ${
                    errors.email ? "ring-2 ring-red-500" : "focus:ring-blue-500"
                  }`}
                  placeholder="example@gmail.com"
                />
                <Mail className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 rounded-lg bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-3 pr-10 rounded-lg bg-gray-100 text-gray-900 focus:ring-2 outline-none transition ${
                    errors.confirmPassword ? "ring-2 ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600 transition"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">WhatsApp Number</label>
            <div className="relative">
              <input
                type="text"
                name="whatsapp"
                required
                placeholder="08xxxxxxxxxx"
                value={formData.whatsapp}
                onChange={handleChange}
                inputMode="numeric"
                className="w-full p-3 pr-10 rounded-lg bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <Phone className="absolute right-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-[0.98] mt-4"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}