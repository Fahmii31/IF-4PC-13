"use client";

import React from "react";
import { User, Mail, Phone } from "lucide-react";

interface PersonalDetailsCardProps {
  username: string;
  email: string;
  phone: string;
}

export default function PersonalDetailsCard({ username, email, phone }: PersonalDetailsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
          Personal Details
        </h3>

        <p className="text-sm text-gray-500 mt-1">View your account information.</p>
      </div>

      <div className="space-y-4">
        {/* Username */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <User size={18} />
          </div>

          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Username</p>
            <p className="mt-0.5 text-gray-900 font-semibold text-sm">{username}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Mail size={18} />
          </div>

          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
              Email Address
            </p>
            <p className="mt-0.5 text-gray-900 font-semibold break-all text-sm">{email}</p>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
            <Phone size={18} />
          </div>

          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
              WhatsApp Number
            </p>
            <p className="mt-0.5 text-gray-900 font-semibold text-sm">{phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
