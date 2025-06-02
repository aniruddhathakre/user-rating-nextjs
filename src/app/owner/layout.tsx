import React from "react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Owner Dashboard</h1>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
