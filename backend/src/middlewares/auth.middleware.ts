import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  id: string;
  role: "admin" | "sales";
  iat: number;
  exp: number;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_key_for_smart_leads_dashboard_2026"
    ) as DecodedToken;

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      message: "Not authorized, token invalid or expired",
    });
  }
};
