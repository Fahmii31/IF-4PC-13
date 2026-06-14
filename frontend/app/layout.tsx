import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";

// 1. IMPORT PROVIDER DI SINI
import { NotificationProvider } from "@/components/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Kamu bisa sekalian ubah metadata title-nya di sini agar lebih keren
export const metadata: Metadata = {
  title: "VoltCore - Power Intelligence",
  description: "Smart energy management based on IoT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {/* 2. BUNGKUS CHILDREN DENGAN NOTIFICATION PROVIDER */}
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
