"use client";

import { useEffect, useState } from "react";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/admin/stores", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = stores.filter(
    (store: any) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Stores</h2>

      <input
        type="text"
        placeholder="Search by name or address"
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((store: any) => (
            <tr key={store.id}>
              <td className="border p-2">{store.name}</td>
              <td className="border p-2">{store.address}</td>
              <td className="border p-2">{store.email || "N/A"}</td>
              <td className="border p-2">{store.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
