"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { current: string; new: string; confirm: string }) => Promise<void>;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  if (!isOpen) return null;

  const resetForm = () => {
    setPasswords({ current: "", new: "", confirm: "" });
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New password and confirmation do not match!");
      return;
    }

    if (passwords.current === passwords.new) {
      toast.error("New password must be different from current password!");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(passwords);
      toast.success("Password changed successfully!");
      resetForm();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to change password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormIncomplete = !passwords.current || !passwords.new || !passwords.confirm;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-5">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <Lock size={18} />
              Change Password
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your current password and create a stronger password.
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-800 transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Current Password</label>
            <div className="relative mt-1.5">
              <input
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                autoComplete="current-password"
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full rounded-xl border p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">New Password</label>
            <div className="relative mt-1.5">
              <input
                type={showNew ? "text" : "password"}
                value={passwords.new}
                autoComplete="new-password"
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full rounded-xl border p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Confirm Password</label>
            <div className="relative mt-1.5">
              <input
                type={showConfirm ? "text" : "password"}
                value={passwords.confirm}
                autoComplete="new-password"
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full rounded-xl border p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
            <p className="font-semibold text-blue-700 text-xs">Password Requirements</p>
            <ul className="mt-1.5 ml-4 list-disc text-xs text-blue-600 space-y-0.5">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-5 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || isFormIncomplete}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition ${
              loading || isFormIncomplete
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 hover:bg-black text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
