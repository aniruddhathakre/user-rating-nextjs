"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/tokenHelpers";

export function useProtectedRoute(
  allowedRoles: ("ADMIN" | "USER" | "STORE_OWNER")[]
) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const user = getUserFromToken(token);

    if (!user || !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [router, allowedRoles]);
}
