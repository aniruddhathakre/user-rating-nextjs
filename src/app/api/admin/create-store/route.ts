import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getTokenData(req);
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, address, ownerId } = body;

    if (!name || !email || !ownerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Create Store Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
