import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/auth";

const protectedRoute = ["/dashboard", "/admin", "/owner"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedRoute.some((route) => pathname.startsWith(route))) {
    const token = req.headers.get("authorization")?.replace("Bearer", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        role: string;
      };

      if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden: Admins only" },
          { status: 403 }
        );
      }

      if (pathname.startsWith("/owner") && decoded.role !== "STORE_OWNER") {
        return NextResponse.json(
          { error: "Forbidden: Store Owners only" },
          { status: 403 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/owner/:path*"],
};
