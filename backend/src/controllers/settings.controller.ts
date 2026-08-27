import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

const DAY_IDS = [
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu",
  "minggu",
];
const DEFAULT_DAYS = ["senin", "selasa", "rabu", "kamis", "jumat"];
const DEFAULT_WHATSAPP = "081234567890";

export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    const row = await prisma.systemSetting.findUnique({ where: { id: 1 } });
    const days = row
      ? row.days.split(",").filter((d) => DAY_IDS.includes(d))
      : DEFAULT_DAYS;
    const whatsapp = row?.whatsapp || DEFAULT_WHATSAPP;

    return res.status(200).json({
      data: {
        days,
        whatsapp,
      },
    });
  } catch (error) {
    console.error("Error getSystemSettings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const { days, whatsapp } = req.body;

    const current = await prisma.systemSetting.findUnique({ where: { id: 1 } });
    let daysToSave = current ? current.days : DEFAULT_DAYS.join(",");
    let whatsappToSave = current ? current.whatsapp : DEFAULT_WHATSAPP;

    if (days !== undefined) {
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

      daysToSave = days.join(",");
    }

    if (whatsapp !== undefined) {
      if (typeof whatsapp !== "string" || whatsapp.trim().length === 0) {
        return res
          .status(400)
          .json({ message: "Nomor WhatsApp harus berupa teks dan tidak boleh kosong" });
      }
      whatsappToSave = whatsapp.trim();
    }

    const row = await prisma.systemSetting.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        days: daysToSave,
        whatsapp: whatsappToSave,
      },
      update: {
        days: daysToSave,
        whatsapp: whatsappToSave,
      },
    });

    return res.status(200).json({
      message: "Pengaturan sistem berhasil diperbarui",
      data: {
        days: row.days.split(",").filter((d) => DAY_IDS.includes(d)),
        whatsapp: row.whatsapp,
      },
    });
  } catch (error) {
    console.error("Error updateSystemSettings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkingDays = getSystemSettings;
export const updateWorkingDays = updateSystemSettings;
