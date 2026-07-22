"use client";

import React from "react";
import { User as UserIcon, Edit3 } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  email: string;
  onEditProfile: () => void;
}

export default function ProfileHeader({ username, email, onEditProfile }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
        <UserIcon size={32} />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl font-bold text-gray-900">{username}</h2>
        <p className="text-xs text-gray-500 mt-1">{email}</p>
      </div>

      <button
        onClick={onEditProfile}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-sm shadow-sm"
      >
        <Edit3 size={16} />
        Edit Profile
      </button>
    </div>
  );
}
