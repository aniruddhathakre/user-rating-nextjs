import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getTokenData(req);

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCount = await prisma.user.count();
    const storeCount = await prisma.store.count();
    const ratingCount = await prisma.rating.count();

    return NextResponse.json({
      userCount,
      storeCount,
      ratingCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
