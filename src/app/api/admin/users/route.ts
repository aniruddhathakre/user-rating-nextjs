import { NextResponse } from "next/server";
import { getTokenData } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await getTokenData(req);

  //   if (user?.role !== "ADMIN") {
  //     return NextResponse.json({ error: "Unauthorizeddd" }, { status: 400 });
  //   }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
