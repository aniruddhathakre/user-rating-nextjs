import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
