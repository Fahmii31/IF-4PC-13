// components/landing/Navbar.tsx
"use client";

import { Zap, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [mobileMenu, setMobileMenu] = useState(false);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);

    element?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>

          <span className="font-bold text-lg tracking-tight text-slate-900">
            VoltCore
          </span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <button
            onClick={() => scrollTo("features")}
            className="hover:text-blue-600 transition"
          >
            Features
          </button>

          <button
            onClick={() => scrollTo("analytics")}
            className="hover:text-blue-600 transition"
          >
            Analytics
          </button>

          <button
            onClick={() => scrollTo("about-us")}
            className="hover:text-blue-600 transition"
          >
            About Us
          </button>
        </div>

        {/* DESKTOP BUTTON */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-md"
          >
            Register
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-slate-700"
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4">

          <button
            onClick={() => scrollTo("features")}
            className="block w-full text-left text-sm font-medium text-slate-600"
          >
            Features
          </button>

          <button
            onClick={() => scrollTo("analytics")}
            className="block w-full text-left text-sm font-medium text-slate-600"
          >
            Analytics
          </button>

          <button
            onClick={() => scrollTo("about-us")}
            className="block w-full text-left text-sm font-medium text-slate-600"
          >
            About Us
          </button>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => router.push("/login")}
              className="w-full border border-slate-200 py-2 rounded-xl text-sm font-semibold"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}