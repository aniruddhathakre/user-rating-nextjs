"use client";

import { useEffect, useState } from "react";

export default function CreateStorePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [owners, setOwners] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  //   const token = localStorage.getItem("token");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    async function fetchOwners() {
      const res = await fetch("/api/admin/users_store_owner?role=STORE_OWNER", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setOwners(data.users || []);
    }

    fetchOwners();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/admin/create-store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("✅ Store created successfully!");
      setForm({ name: "", email: "", address: "", ownerId: "" });
    } else {
      setMessage("❌ Failed to create store.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          placeholder="Store Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="address"
          placeholder="Store Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="ownerId"
          value={form.ownerId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">-- Select Store Owner --</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Create Store
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
