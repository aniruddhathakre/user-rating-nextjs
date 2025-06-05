"use client";

import { useState } from "react";

export default function CreateUserPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("✅ User created successfully!");
      setForm({ name: "", email: "", address: "", password: "", role: "USER" });
    } else {
      setMessage("❌ Failed to create user.");
    }
  };
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="USER">User</option>
          <option value="OWNER">Store Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Create User
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
