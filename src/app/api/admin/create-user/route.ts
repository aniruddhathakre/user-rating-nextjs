import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getTokenData } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getTokenData(req);

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, address, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Create User Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
