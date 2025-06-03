"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: "USER" | "ADMIN" | "STORE_OWNER";
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  function handleSort(field: "name" | "email" | "address" | "role") {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const filterUsers = users
    .filter((user) =>
      `${user.name} ${user.email} ${user.address}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((user) => (roleFilter ? user.role === roleFilter : true))
    .sort((a, b) => {
      const valA = a[sortField].toString().toLowerCase();
      const valB = b[sortField].toString().toLowerCase();
      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name/email/address"
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <table className="w-full border text-left text-sm">
        <thead>
          <tr>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("address")}
            >
              Address{" "}
              {sortField === "address" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("role")}
            >
              Role {sortField === "role" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filterUsers.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-100">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.address}</td>
              <td className="p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
