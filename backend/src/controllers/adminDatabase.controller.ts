import { Request, Response } from "express";
import ExcelJS from "exceljs";
import prisma from "../lib/prisma";
import { getDatabaseStorageUsage } from "../lib/prismaManagement";
import { logActivity } from "../lib/activityLog";

// ── Constants (sama dengan reports.controller.ts) ──────────────────────────
const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF0F2018" },
};

const ALT_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF7F9F8" },
};

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  bottom: { style: "thin" },
  left: { style: "thin" },
  right: { style: "thin" },
};

const setTableHeader = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const getHealthStatus = (pct: number): "healthy" | "warning" | "critical" => {
  if (pct >= 90) return "critical";
  if (pct >= 70) return "warning";
  return "healthy";
};

// ── GET /admin/database/stats ─────────────────────────────────────────────
export const getDatabaseStats = async (_req: Request, res: Response) => {
  try {
    const [storage, totalBookings, totalUsers, totalRooms] = await Promise.all([
      getDatabaseStorageUsage(),
      prisma.booking.count(),
      prisma.user.count(),
      prisma.room.count(),
    ]);

    const usedBytes = storage?.usedBytes ?? 0;
    const maxBytes = storage?.limitBytes ?? 536870912; // 512 MB default
    const percentage = maxBytes > 0 ? Math.round((usedBytes / maxBytes) * 1000) / 10 : 0;

    return res.status(200).json({
      data: {
        usedBytes,
        usedFormatted: formatBytes(usedBytes),
        maxBytes,
        maxFormatted: formatBytes(maxBytes),
        percentage,
        status: getHealthStatus(percentage),
        totalBookings,
        totalUsers,
        totalRooms,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ── GET /admin/database/backup ────────────────────────────────────────────
export const downloadDatabaseBackup = async (_req: Request, res: Response) => {
  try {
    const [users, rooms, sessions, bookings, prices, settings, logs] =
      await Promise.all([
        prisma.user.findMany({
          select: {
            id: true, name: true, email: true, role: true, status: true,
            idNumber: true, whatsapp: true, affiliation: true, createdAt: true,
          },
        }),
        prisma.room.findMany({
          select: { id: true, name: true, capacity: true, imageUrl: true },
        }),
        prisma.bookingSession.findMany({
          select: { id: true, name: true, startTime: true, finishTime: true, isRentOnly: true },
        }),
        prisma.booking.findMany({
          select: {
            id: true,
            room: { select: { name: true } },
            session: { select: { name: true } },
            user: { select: { name: true } },
            date: true, status: true, type: true, createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        }),
        prisma.bookingPrice.findMany({
          select: { room: { select: { name: true } }, price: true },
        }),
        prisma.systemSetting.findMany(),
        prisma.adminActivityLog.findMany({
          select: {
            id: true,
            admin: { select: { name: true } },
            action: true, detail: true, createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Booking Perpus";
    workbook.created = new Date();

    // Sheet 1: PENGGUNA
    const wsUsers = workbook.addWorksheet("PENGGUNA");
    wsUsers.columns = [
      { header: "ID", key: "id", width: 28 },
      { header: "NAMA", key: "name", width: 24 },
      { header: "EMAIL", key: "email", width: 28 },
      { header: "ROLE", key: "role", width: 12 },
      { header: "STATUS", key: "status", width: 14 },
      { header: "NOMOR ID", key: "idNumber", width: 18 },
      { header: "WHATSAPP", key: "whatsapp", width: 18 },
      { header: "INSTANSI/PRODI", key: "affiliation", width: 24 },
      { header: "DIBUAT", key: "createdAt", width: 22 },
    ];
    setTableHeader(wsUsers.getRow(1));
    for (let i = 0; i < users.length; i++) {
      const row = wsUsers.addRow(users[i]);
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
    }

    // Sheet 2: RUANGAN
    const wsRooms = workbook.addWorksheet("RUANGAN");
    wsRooms.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "NAMA", key: "name", width: 24 },
      { header: "KAPASITAS", key: "capacity", width: 14 },
      { header: "IMAGE URL", key: "imageUrl", width: 40 },
    ];
    setTableHeader(wsRooms.getRow(1));
    for (let i = 0; i < rooms.length; i++) {
      const row = wsRooms.addRow(rooms[i]);
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
    }

    // Sheet 3: SESI BOOKING
    const wsSessions = workbook.addWorksheet("SESI BOOKING");
    wsSessions.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "NAMA", key: "name", width: 20 },
      { header: "JAM MULAI", key: "startTime", width: 14 },
      { header: "JAM SELESAI", key: "finishTime", width: 14 },
      { header: "SEWA SAJA", key: "isRentOnly", width: 14 },
    ];
    setTableHeader(wsSessions.getRow(1));
    for (let i = 0; i < sessions.length; i++) {
      const row = wsSessions.addRow(sessions[i]);
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
    }

    // Sheet 4: BOOKING
    const wsBookings = workbook.addWorksheet("BOOKING");
    wsBookings.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "RUANGAN", key: "roomName", width: 24 },
      { header: "SESI", key: "sessionName", width: 20 },
      { header: "PENGGUNA", key: "userName", width: 28 },
      { header: "TANGGAL", key: "date", width: 18 },
      { header: "STATUS", key: "status", width: 14 },
      { header: "TIPE", key: "type", width: 10 },
      { header: "DIBUAT", key: "createdAt", width: 22 },
    ];
    setTableHeader(wsBookings.getRow(1));
    for (let i = 0; i < bookings.length; i++) {
      const b = bookings[i];
      const row = wsBookings.addRow({
        id: b.id,
        roomName: b.room.name,
        sessionName: b.session.name,
        userName: b.user.name,
        date: b.date.toISOString(),
        status: b.status,
        type: b.type,
        createdAt: b.createdAt.toISOString(),
      });
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
    }

    // Sheet 5: HARGA BOOKING
    const wsPrices = workbook.addWorksheet("HARGA BOOKING");
    wsPrices.columns = [
      { header: "RUANGAN", key: "roomName", width: 24 },
      { header: "HARGA", key: "price", width: 18 },
    ];
    setTableHeader(wsPrices.getRow(1));
    for (let i = 0; i < prices.length; i++) {
      const p = prices[i];
      const row = wsPrices.addRow({ roomName: p.room.name, price: p.price.toString() });
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
    }

    // Sheet 6: PENGATURAN
    const wsSettings = workbook.addWorksheet("PENGATURAN");
    wsSettings.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "HARI", key: "days", width: 40 },
      { header: "WHATSAPP", key: "whatsapp", width: 20 },
    ];
    setTableHeader(wsSettings.getRow(1));
    for (let i = 0; i < settings.length; i++) {
      const row = wsSettings.addRow(settings[i]);
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
    }

    // Sheet 7: LOG AKTIVITAS
    const wsLogs = workbook.addWorksheet("LOG AKTIVITAS");
    wsLogs.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "ADMIN", key: "adminName", width: 28 },
      { header: "AKSI", key: "action", width: 24 },
      { header: "DETAIL", key: "detail", width: 40 },
      { header: "DIBUAT", key: "createdAt", width: 22 },
    ];
    setTableHeader(wsLogs.getRow(1));
    for (let i = 0; i < logs.length; i++) {
      const l = logs[i];
      const row = wsLogs.addRow({
        id: l.id,
        adminName: l.admin.name,
        action: l.action,
        detail: l.detail,
        createdAt: l.createdAt.toISOString(),
      });
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const filename = `BACKUP_DATABASE_PERPUS_${timestamp}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ── POST /admin/database/clear ────────────────────────────────────────────
export const clearDatabaseBookings = async (req: Request, res: Response) => {
  try {
    const { confirmationText } = req.body;

    if (confirmationText !== "HAPUS RIWAYAT") {
      return res.status(400).json({
        data: {
          success: false,
          message: "Konfirmasi tidak valid. Ketik 'HAPUS RIWAYAT' untuk melanjutkan.",
          deletedBookingsCount: 0,
        },
      });
    }

    // Hapus data sebelum awal bulan ini
    const cutoff = new Date();
    cutoff.setDate(1);
    cutoff.setHours(0, 0, 0, 0);

    const [deletedBookings, deletedLogs] = await prisma.$transaction([
      prisma.booking.deleteMany({ where: { createdAt: { lt: cutoff } } }),
      prisma.adminActivityLog.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    ]);

    logActivity(
      req.userId!,
      "CLEAR_DATABASE",
      `Menghapus ${deletedBookings.count} booking dan ${deletedLogs.count} log aktivitas`,
    );

    return res.status(200).json({
      data: {
        success: true,
        message: `Berhasil menghapus ${deletedBookings.count} booking dan ${deletedLogs.count} log aktivitas lama.`,
        deletedBookingsCount: deletedBookings.count,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
