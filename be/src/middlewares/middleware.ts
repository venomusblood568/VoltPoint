import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return
  }
};
