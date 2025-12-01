import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyUser(req, _, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader.split("Bearer ")[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  req.user = decoded;

  next();
}
