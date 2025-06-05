import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  const user = await getTokenData(req);
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Replace 'Role' with your actual enum import if needed, e.g., import { Role } from "@prisma/client";
  const validRoles = ["ADMIN", "USER", "STORE_OWNER"]; // adjust according to your Role enum
  const roleFilter =
    role && validRoles.includes(role) ? (role as any) : undefined;

  const users = await prisma.user.findMany({
    where: { role: roleFilter },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ users });
}
