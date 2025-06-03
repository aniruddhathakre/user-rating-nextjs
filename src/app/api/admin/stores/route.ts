import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getTokenData(req);

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      include: {
        ratings: true,
      },
    });

    const storesWithRating = stores.map((store) => {
      const avgRating =
        store.ratings.reduce((sum, r) => sum + r.score, 0) /
        (store.ratings.length || 1);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        rating: avgRating.toFixed(2),
      };
    });

    return NextResponse.json(storesWithRating);
  } catch (error) {
    console.error("Error fetching stores", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
