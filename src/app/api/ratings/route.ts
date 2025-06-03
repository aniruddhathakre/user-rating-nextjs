import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = (await getTokenData(req)) as any;

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { storeId, score } = await req.json();

    if (!storeId || score < 1 || score > 5) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const existing = await prisma.rating.findFirst({
      where: { userId: Number(user.userId), storeId },
    });

    if (existing) {
      await prisma.rating.update({
        where: { id: existing.id },
        data: { score },
      });
    } else {
      await prisma.rating.create({
        data: {
          userId: Number(user.userId),
          storeId,
          score,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
