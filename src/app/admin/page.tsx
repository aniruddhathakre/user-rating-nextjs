"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    userCount: 0,
    storeCount: 0,
    ratingCount: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold text-lg">Total Users</h3>
          <p>{stats.userCount}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold text-lg">Total Stores</h3>
          <p>{stats.storeCount}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold text-lg">Total Ratings</h3>
          <p>{stats.ratingCount}</p>
        </div>
      </div>
    </div>
  );
}
