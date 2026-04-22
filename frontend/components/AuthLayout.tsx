import Logo from "./Logo";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-slate-50 via-blue-50 to-blue-200 p-6">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 relative text-white p-14 flex-col justify-between">

          {/* BACKGROUND IMAGE */}
          <Image
            src="/house.jpg"
            alt="house"
            fill
            sizes="50vw"
            className="object-cover"
          />

          {/* OVERLAY (LEBIH DALAM & GRADIENT) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-700/80" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col justify-between h-full">

            <Logo />

            <div>
              <h1 className="text-4xl font-semibold leading-snug mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-500 bg-clip-text text-transparent">
                  Smarter Energy
                </span>
                <br />
                <span className="text-white/90">
                  Starts at Home
                </span>
              </h1>

              <p className="text-sm text-blue-100 leading-relaxed">
                Monitor, analyze, and optimize your home&apos;s power usage
                with real-time intelligence designed for efficiency and control.
              </p>
            </div>

            {/* subtle line / accent */}
            <div className="w-16 h-1 bg-white/30 rounded-full" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-14 bg-white">
          {children}
        </div>

      </div>
    </div>
  );
}