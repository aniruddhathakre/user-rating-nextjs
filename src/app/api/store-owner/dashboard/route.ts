import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = (await getTokenData(req)) as any;

    if (!user || user.role !== "STORE_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findFirst({
      where: { ownerId: user.id },
      include: {
        ratings: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Calculate average rating
    const ratings = store.ratings;
    const averageRating =
      ratings.reduce((sum, r) => sum + r.score, 0) / (ratings.length || 1);

    return NextResponse.json({
      storeId: store.id,
      storeName: store.name,
      averageRating,
      ratings: ratings.map((r) => ({
        ratingId: r.id,
        rating: r.score,
        user: r.user,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
