import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyUser(req, _, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = new Error("Missing authorization header");
      error.status = 401;
      throw error;
    }

    const parts = authHeader.split("Bearer ");
    if (parts.length !== 2) {
      const error = new Error("Invalid authorization header format");
      error.status = 401;
      throw error;
    }

    const token = parts[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    const error = new Error(err.message || "Authentication failed");
    error.status = err.status || 401;
    next(error);
  }
}
