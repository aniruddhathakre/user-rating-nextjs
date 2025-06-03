import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/auth";

interface AuthToken {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: Request) {
  try {
    const user = (await getTokenData(req)) as unknown as AuthToken;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      include: {
        ratings: {
          //   where: { userId: Number(user.id) },
          where: { userId: user.userId },
        },
        _count: {
          select: { ratings: true },
        },
      },
    });

    const storesWithUserRating = await Promise.all(
      stores.map(async (store) => {
        const allRatings = await prisma.rating.findMany({
          where: { storeId: store.id },
        });

        const avgRating =
          allRatings.reduce((sum, r) => sum + r.score, 0) /
          (allRatings.length || 1);

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          avgRating: avgRating.toFixed(),
          userRating: store.ratings[0]?.score || null,
        };
      })
    );
    return NextResponse.json(storesWithUserRating);
  } catch (error) {
    const err = error as Error;
    console.error("API /api/stores error:", err.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
