"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, LockKeyhole, ArrowRight } from "lucide-react";

interface SecurityCardProps {
  isGoogleUser?: boolean;
  onChangePassword: () => void;
}

export default function SecurityCard({ isGoogleUser, onChangePassword }: SecurityCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Account Security
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Protect your account credentials and keep your account secure.
        </p>
      </div>

      {isGoogleUser ? (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h4 className="font-bold text-gray-900">Google Account</h4>

              <p className="text-sm text-gray-500 mt-1">
                Your password is securely managed by Google.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="text-green-600 mt-1" size={18} />

              <div>
                <p className="font-semibold text-green-700">Secure Authentication</p>

                <p className="text-sm text-green-600 mt-1">
                  Since you signed in with Google, password updates must be performed through your
                  Google Account.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Password */}
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <LockKeyhole size={22} />
            </div>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Password</p>

              <p className="text-lg font-bold text-gray-900 tracking-widest mt-0.5">••••••••••••</p>

              <p className="text-sm text-gray-500 mt-1">
                Change your password regularly to keep your account protected.
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="text-blue-600 mt-1 flex-shrink-0" size={18} />

              <div>
                <p className="font-semibold text-blue-800">Password Protection</p>

                <p className="text-sm text-blue-700 mt-1">
                  Updating your password periodically helps prevent unauthorized access to your
                  VoltCore account.
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={onChangePassword}
            className="
              w-full
              py-2.5
              rounded-xl
              bg-gray-900
              hover:bg-black
              text-white
              font-semibold
              transition
              flex
              justify-center
              items-center
              gap-2
            "
          >
            Change Password
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
