"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  phone: string;
  onSave: (data: { username: string; phone: string }) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  username,
  phone,
  onSave,
}: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [editedUsername, setEditedUsername] = useState<string | null>(null);
  const [editedPhone, setEditedPhone] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUsername = editedUsername !== null ? editedUsername : username || "";
  const currentPhone = editedPhone !== null ? editedPhone : phone || "";

  const handleClose = () => {
    setEditedUsername(null);
    setEditedPhone(null);
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave({
        username: currentUsername,
        phone: currentPhone,
      });
      toast.success("Profile updated successfully!");
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isUnchanged = currentUsername === username && currentPhone === phone;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
            <p className="text-xs text-gray-500 mt-1">Update your account information.</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-800 transition">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Username</label>
            <input
              value={currentUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="mt-1.5 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">WhatsApp Number</label>
            <input
              value={currentPhone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setEditedPhone(onlyNumbers);
              }}
              placeholder="081234567890"
              className="mt-1.5 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
            />
          </div>
        </div>

        {/* FOOTER */}
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
            disabled={loading || isUnchanged}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition ${
              loading || isUnchanged
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
