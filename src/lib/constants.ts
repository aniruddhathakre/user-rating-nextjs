const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

export const JWT_SECRET = jwtSecret;
