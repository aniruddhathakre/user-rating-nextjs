import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/constants";
import { NextResponse } from "next/server";

export interface DecodedToken {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "OWNER";
}

export function getTokenData(req: Request): DecodedToken | null {
  try {
    const authHeader = req.headers.get("authorization");

    // console.log("Raw authorization header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    console.log(decoded);

    return decoded;
  } catch (error) {
    console.error("Invalid or expired token");
    return null;
  }
}
