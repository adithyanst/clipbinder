import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyUser(req) {
  const authHeader = req.headers.authorization;

  const token = authHeader.split("Bearer ")[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  return { decoded: decoded };
}
