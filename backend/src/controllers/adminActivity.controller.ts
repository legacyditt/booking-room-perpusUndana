import { Request, Response } from "express";
import ExcelJS from "exceljs";
import prisma from "../lib/prisma.js";
import {
  ALT_FILL,
  THIN_BORDER,
  formatDateTime,
  setTableHeader,
} from "../lib/excel.js";

const ACTION_LABELS: Record<string, string> = {
  CREATE_ROOM: "Tambah Ruangan",
  UPDATE_ROOM: "Ubah Ruangan",
  DELETE_ROOM: "Hapus Ruangan",
  CREATE_SESSION: "Tambah Sesi",
  UPDATE_SESSION: "Ubah Sesi",
  DELETE_SESSION: "Hapus Sesi",
  APPROVE_BOOKING: "Setujui Booking",
  REJECT_BOOKING: "Tolak Booking",
  CANCEL_BOOKING: "Batalkan Booking",
  UPDATE_USER_ROLE: "Ubah Peran",
  CREATE_ADMINS: "Tambah Admin",
  DELETE_USER: "Hapus Pengguna",
};

const buildWhere = (query: Record<string, unknown>) => {
  const { adminId, action, startDate, endDate } = query;

  const where: Record<string, unknown> = {};
  if (adminId) where.adminId = adminId as string;
  if (action) where.action = action as string;
  if (startDate) where.createdAt = { gte: new Date(startDate as string) };
  if (endDate) {
    const end = new Date(endDate as string);
    end.setDate(end.getDate() + 1);
    where.createdAt = { ...(where.createdAt as object), lt: end };
  }

  return where;
};

export const getAdminActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.adminActivityLog.findMany({
      where: buildWhere(req.query),
      include: { admin: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: activities });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const exportAdminActivities = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const activities = await prisma.adminActivityLog.findMany({
      where: buildWhere(req.query),
      include: { admin: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const periodParts = [
      startDate && `DARI ${startDate}`,
      endDate && `SAMPAI ${endDate}`,
    ].filter(Boolean);
    const periodLabel = periodParts.length
      ? `PERIODE: ${periodParts.join(" ")}`
      : "PERIODE: SEMUA WAKTU";

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Booking Perpus";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("AKTIVITAS ADMIN", {
      views: [{ state: "frozen", ySplit: 4 }],
      properties: { defaultColWidth: 18 },
    });

    const titleRows = [
      "LAPORAN AKTIVITAS ADMIN",
      "UPT PERPUSTAKAAN UNIVERSITAS NUSA CENDANA",
      periodLabel,
    ];
    titleRows.forEach((text, i) => {
      const row = sheet.getRow(i + 1);
      row.height = 24;
      sheet.mergeCells(i + 1, 1, i + 1, 4);
      const cell = row.getCell(1);
      cell.value = text;
      cell.font = { bold: true, size: i === 2 ? 12 : 14 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    const headerRow = sheet.getRow(4);
    headerRow.values = ["ADMIN", "AKSI", "DETAIL", "WAKTU"];
    headerRow.height = 22;
    setTableHeader(headerRow);

    activities.forEach((activity, idx) => {
      const row = sheet.getRow(idx + 5);
      row.values = [
        activity.admin.name,
        ACTION_LABELS[activity.action] ?? activity.action,
        activity.detail ?? "",
        formatDateTime(activity.createdAt),
      ];
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (idx % 2 === 1) cell.fill = ALT_FILL;
      });
    });

    sheet.columns.forEach((col, i) => {
      let width = 24;
      if (i === 1) width = 20;
      if (i === 2) width = 46;
      if (i === 3) width = 24;
      col.width = width;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="LOG_AKTIVITAS_ADMIN.xlsx"',
    );
    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};