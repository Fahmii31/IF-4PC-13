"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalDetailsCard from "@/components/profile/PersonalDetailsCard";
import SecurityCard from "@/components/profile/SecurityCard";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/logout";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleUpdateProfile = async (data: { username: string; phone: string }) => {
    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });

    const xsrfToken = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] || ""
    );

    const res = await fetch("http://localhost:8000/api/update-profile", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": xsrfToken,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 422 && result.errors) {
        throw new Error(Object.values(result.errors).flat().join("\n"));
      } else {
        throw new Error(result.message || "Update failed");
      }
    }

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleChangePassword = async (data: { current: string; new: string; confirm: string }) => {
    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });

    const xsrfToken = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] || ""
    );

    const res = await fetch("http://localhost:8000/api/change-password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": xsrfToken,
      },
      body: JSON.stringify({
        current_password: data.current,
        new_password: data.new,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 422 && result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(". ");
        throw new Error(errorMessages);
      }

      throw new Error(result.message || "Failed to change password");
    }

    await logoutUser();
    router.replace("/login");
  };

  return (
    <>
      <MainLayout
        title="My Profile"
        user={user}
        onNotificationClick={() => setIsNotificationOpen(true)}
      >
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          <ProfileHeader
            username={user?.username ?? ""}
            email={user?.email ?? ""}
            onEditProfile={() => setShowEditProfile(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PersonalDetailsCard
              username={user?.username ?? ""}
              email={user?.email ?? ""}
              phone={user?.phone ?? ""}
            />

            <SecurityCard
              isGoogleUser={user?.is_google_user}
              onChangePassword={() => setShowChangePassword(true)}
            />
          </div>
        </div>

        <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      </MainLayout>

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        username={user?.username ?? ""}
        phone={user?.phone ?? ""}
        onSave={handleUpdateProfile}
      />

      {!user?.is_google_user && (
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => setShowChangePassword(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </>
  );
}
