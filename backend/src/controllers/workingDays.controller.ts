import { Request, Response } from "express";
import prisma from "../lib/prisma";

const DAY_IDS = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
const DEFAULT_DAYS = ["senin", "selasa", "rabu", "kamis", "jumat"];

export const getWorkingDays = async (req: Request, res: Response) => {
  try {
    const row = await prisma.workingDays.findUnique({ where: { id: 1 } });
    const days = row
      ? row.days.split(",").filter((d) => DAY_IDS.includes(d))
      : DEFAULT_DAYS;
    return res.status(200).json({ data: { days } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWorkingDays = async (req: Request, res: Response) => {
  try {
    const { days } = req.body;

    if (!Array.isArray(days) || days.length === 0) {
      return res
        .status(400)
        .json({ message: "days harus berupa array non-kosong" });
    }

    const invalid = days.filter((d) => !DAY_IDS.includes(d));
    if (invalid.length > 0) {
      return res
        .status(400)
        .json({ message: `Hari tidak valid: ${invalid.join(", ")}` });
    }

    const row = await prisma.workingDays.upsert({
      where: { id: 1 },
      create: { id: 1, days: days.join(",") },
      update: { days: days.join(",") },
    });

    return res.status(200).json({
      message: "Working days updated successfully",
      data: { days: row.days.split(",") },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
