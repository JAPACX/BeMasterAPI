import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = (process.env.JWT_SECRET as string) || "secret_example";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export function generateToken(username: string) {
  return jwt.sign({ username }, SECRET, { expiresIn: EXPIRES_IN });
}

export function validateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send({ error: "Access denied" });
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: "Access denied, invalid or expired token" });
    }
    req.userId = decoded;
    next();
  });
}
