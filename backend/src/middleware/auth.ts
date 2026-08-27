import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

const getSession = async (req: Request) =>
  auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId = session.user.id;
  req.userRole = session.user.role ?? undefined;
  return next();
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin access required" });
  }
  req.userId = session.user.id;
  req.userRole = session.user.role ?? undefined;
  return next();
};
