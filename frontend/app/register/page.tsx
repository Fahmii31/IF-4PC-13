"use client";

import AuthLayout from "@/components/layout/AuthLayout";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  interface RegisterErrors {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string;
    phone?: string[];
  }

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    whatsapp: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: RegisterErrors = {};

    // VALIDASI EMAIL
    if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
      newErrors.email = ["Email must use @gmail.com"];
    }

    // VALIDASI PASSWORD MATCH
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.whatsapp,
      });

      const result = await res.json();

      // VALIDATION ERROR
      if (!res.ok) {
        if (res.status === 422 && result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.message || "Register failed");
        }
        return;
      }

      alert(result.message || "Register success 🎉");
      router.replace("/login");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2 leading-tight">
          Create your account
        </h2>

        <p className="text-sm sm:text-base text-gray-500 text-center mb-6 sm:mb-8">
          Join and start monitoring your energy usage
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* USERNAME */}
            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Jhon Doe"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full h-12 sm:h-14 px-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 outline-none transition
                    ${errors.username ? "ring-2 ring-red-500" : "focus:ring-blue-500"}`}
                />
                <User
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-[11px] mt-1 font-medium">
                  {errors.username}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`w-full h-12 sm:h-14 px-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 outline-none transition
                    ${errors.email ? "ring-2 ring-red-500" : "focus:ring-blue-500"}`}
                />
                <Mail
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full h-12 sm:h-14 px-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 outline-none transition
                    ${errors.password ? "ring-2 ring-red-500" : "focus:ring-blue-500"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full h-12 sm:h-14 px-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 outline-none transition
                    ${errors.confirmPassword ? "ring-2 ring-red-500" : "focus:ring-blue-500"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] mt-1 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              WhatsApp Number
            </label>
            <div className="relative">
              <input
                type="text"
                name="whatsapp"
                required
                placeholder="08xxxxxxxxxx"
                value={formData.whatsapp}
                onChange={handleChange}
                inputMode="numeric"
                className={`w-full h-12 sm:h-14 px-4 pr-10 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 outline-none transition
                  ${errors.phone ? "ring-2 ring-red-500" : "focus:ring-blue-500"}`}
              />
              <Phone
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {errors.phone}
              </p>
            )}
          </div>

          {/* SIGN UP BUTTON (MAIN SUBMIT) */}
          <button
            type="submit"
            className="w-full h-12 sm:h-14 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-md mt-2"
          >
            Sign Up
          </button>

          {/* VISUAL LAYOUT PARTITION (SEPARATOR) */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
              Or
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* GOOGLE LOGIN / CONTINUE WITH GOOGLE */}
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

        <p className="text-center mt-6 sm:mt-8 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
