"use client";

import { useEffect, useState } from "react";

export default function UserStores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/stores", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  const handleRating = async (storeId: string, score: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ storeId, score }),
    });
    if (res.ok) {
      alert("Rating submitted"), location.reload();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stores</h2>

      <div className="grid gap-4">
        {stores.map((store: any) => (
          <div
            key={store.id}
            className="p-4 border rounded shadow bg-white flex flex-col gap-2"
          >
            <div className="font-bold text-lg">{store.name}</div>
            <div>{store.address}</div>
            <div>Average Rating: ⭐ {store.avgRating}</div>
            <div>
              Your Rating:{" "}
              {store.userRating ? (
                <>
                  ⭐ {store.userRating}
                  <span className="ml-2">(You can update it)</span>
                </>
              ) : (
                "Not rated yet"
              )}
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className="px-3 py-1 border rounded bg-gray-100 hover:bg-blue-100"
                  onClick={() => handleRating(store.id, num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
