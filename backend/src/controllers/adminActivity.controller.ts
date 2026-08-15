import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAdminActivities = async (req: Request, res: Response) => {
  try {
    const { adminId, action, startDate, endDate } = req.query;

    const where: Record<string, unknown> = {};
    if (adminId) where.adminId = adminId as string;
    if (action) where.action = action as string;
    if (startDate) where.createdAt = { gte: new Date(startDate as string) };
    if (endDate) {
      const end = new Date(endDate as string);
      end.setDate(end.getDate() + 1);
      where.createdAt = { ...(where.createdAt as object), lt: end };
    }

    const activities = await prisma.adminActivityLog.findMany({
      where,
      include: { admin: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: activities });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
