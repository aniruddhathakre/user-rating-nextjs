"use client";

import { useEffect, useState } from "react";

export default function StoreOwnerDashboard() {
  const [data, setData] = useState<{
    storeName: string;
    averageRating: number;
    ratings: {
      rating: number;
      user: { name: string; email: string };
    }[];
  } | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/store-owner/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or Server Error");
        return res.json();
      })
      .then((res) => setData(res))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, Store Owner</h2>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-xl font-semibold">Store: {data.storeName}</h3>
        <p className="text-gray-700">
          Average Rating:{" "}
          <span className="font-bold">{data.averageRating.toFixed(2)}</span>
        </p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Ratings Received:</h3>
        <ul className="space-y-2">
          {data.ratings.map((r, i) => (
            <li key={i} className="border-b pb-2">
              <p>
                <span className="font-semibold">{r.user.name}</span> (
                {r.user.email}) rated:{" "}
                <span className="font-bold">{r.rating}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
