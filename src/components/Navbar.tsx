"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: string;
  role: "USER" | "ADMIN" | "STORE_OWNER";
};

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setRole(decoded.role);
    } catch (error) {
      console.error("Invalid token");
    }
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <Link href="/" className="font-bold text-xl">
        StoreRatings
      </Link>
      <div className="flex gap-4">
        {!role && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
        {role === "USER" && (
          <>
            <Link href="/user/stores">Stores</Link>
            <Link href="/user/ratings">My Ratings</Link>
            <Link href="/logout">Logout</Link>
          </>
        )}

        {role === "STORE_OWNER" && (
          <>
            <Link href="/owner/dashboard">Dashboard</Link>
            <Link href="/logout">Logout</Link>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/stores">Stores</Link>
            <Link href="/admin/create-store">Create Store</Link>
            <Link href="/admin/create-user">Create User</Link>
            <Link href="/logout">Logout</Link>
          </>
        )}
      </div>
    </nav>
  );
}
