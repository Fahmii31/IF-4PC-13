"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { getAuthUser } from "@/lib/auth";

type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  is_google_user: boolean;
};

export function useAuth() {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);

  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const data = await getAuthUser();

        // SESSION INVALID
        if (!data) {

          setUser(null);

          setAuthenticated(false);

          router.replace("/login");

          return;
        }

        // SESSION VALID
        setUser(data);

        setAuthenticated(true);

      } catch (error) {

        console.error(error);

        setUser(null);

        setAuthenticated(false);

        router.replace("/login");

      } finally {

        setLoading(false);
      }
    };

    checkAuth();

    // FIX BACK BROWSER CACHE
    const handlePageShow = (event: PageTransitionEvent) => {

      if (event.persisted) {

        checkAuth();
      }
    };

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    return () => {

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
    };

  }, [router]);

  return {
    user,
    loading,
    authenticated,
    setUser,
  };
}