import jwt from "jsonwebtoken";

export function getUserFromToken(token: string) {
  try {
    const decoded = jwt.decode(token) as {
      id: string;
      email: string;
      role: "ADMIN" | "USER" | "STORE_OWNER";
    };

    return decoded;
  } catch (error) {
    return null;
  }
}
