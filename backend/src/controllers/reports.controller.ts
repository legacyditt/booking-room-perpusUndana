import { Request, Response } from "express";
import ExcelJS from "exceljs";
import prisma from "../lib/prisma";

const MONTHS_ID = [
  "JANUARI",
  "FEBRUARI",
  "MARET",
  "APRIL",
  "MEI",
  "JUNI",
  "JULI",
  "AGUSTUS",
  "SEPTEMBER",
  "OKTOBER",
  "NOVEMBER",
  "DESEMBER",
];

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF0F2018" },
};
const TITLE_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE7EDE9" },
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

interface BookingWithUser {
  user: {
    id: string;
    name: string;
    idNumber: string;
    affiliation: string | null;
    status: string;
  };
  session: {
    name: string;
    startTime: string;
    finishTime: string;
  };
}

const parseMonth = (raw?: string) => {
  const now = new Date();
  const [year, month] =
    raw && /^\d{4}-(0[1-9]|1[0-2])$/.test(raw)
      ? raw.split("-").map(Number)
      : [now.getFullYear(), now.getMonth() + 1];

  return {
    year,
    month,
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
};

const toMin = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getReportBookings = async (monthParam?: string) => {
  const { year, month, start, end } = parseMonth(monthParam);

  const bookings = (await prisma.booking.findMany({
    where: {
      status: "APPROVED",
      date: { gte: start, lt: end },
      user: { is: { status: "mahasiswa" } },
    },
    include: {
      user: {
        select: { id: true, name: true, idNumber: true, affiliation: true, status: true },
      },
      session: {
        select: { name: true, startTime: true, finishTime: true },
      },
    },
    orderBy: { date: "asc" },
  })) as BookingWithUser[];

  return { year, month, bookings };
};

const durationMin = (b: BookingWithUser) =>
  toMin(b.session.finishTime) - toMin(b.session.startTime);

const buildTopByCount = (bookings: BookingWithUser[]) => {
  const map = new Map<string, { name: string; idNumber: string; affiliation: string | null; count: number }>();
  for (const b of bookings) {
    const cur = map.get(b.user.id) ?? {
      name: b.user.name,
      idNumber: b.user.idNumber,
      affiliation: b.user.affiliation,
      count: 0,
    };
    cur.count += 1;
    map.set(b.user.id, cur);
  }
  return [...map.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((u) => ({
      nim: u.idNumber,
      name: u.name,
      programStudi: u.affiliation,
      count: u.count,
    }));
};

const buildTopByDuration = (bookings: BookingWithUser[]) => {
  const map = new Map<string, { name: string; idNumber: string; affiliation: string | null; totalMin: number; visits: number }>();
  for (const b of bookings) {
    const cur = map.get(b.user.id) ?? {
      name: b.user.name,
      idNumber: b.user.idNumber,
      affiliation: b.user.affiliation,
      totalMin: 0,
      visits: 0,
    };
    cur.totalMin += durationMin(b);
    cur.visits += 1;
    map.set(b.user.id, cur);
  }
  return [...map.values()]
    .sort((a, b) => b.totalMin - a.totalMin)
    .slice(0, 10)
    .map((u) => ({
      nim: u.idNumber,
      name: u.name,
      programStudi: u.affiliation,
      totalSessions: u.visits,
      visits: u.visits,
    }));
};

export const getReportSummary = async (req: Request, res: Response) => {
  try {
    const { year, month, bookings } = await getReportBookings(
      req.query.month as string | undefined,
    );

    return res.status(200).json({
      data: {
        month: `${year}-${String(month).padStart(2, "0")}`,
        monthLabel: `${MONTHS_ID[month - 1][0] + MONTHS_ID[month - 1].slice(1).toLowerCase()} ${year}`,
        total: bookings.length,
        topByCount: buildTopByCount(bookings),
        topByDuration: buildTopByDuration(bookings),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const center = (cell: ExcelJS.Cell) => {
  cell.alignment = { horizontal: "center", vertical: "middle" };
};

const setTableHeader = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });
};

export const exportReport = async (req: Request, res: Response) => {
  try {
    const { year, month, bookings } = await getReportBookings(
      req.query.month as string | undefined,
    );
    const monthLabel = MONTHS_ID[month - 1];
    const filename = `KUNJUNGAN_${monthLabel}_TAHUN_${year}.xlsx`;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Booking Perpus";
    workbook.created = new Date();

    // ── Sheet 1: Laporan Kunjungan (log) ─────────────────────────────
    const sheet1 = workbook.addWorksheet(`LAPORAN KUNJUNGAN TAHUN ${year}`, {
      views: [{ state: "frozen", ySplit: 5 }],
      properties: { defaultColWidth: 16 },
    });

    const titleRows = [
      "LAPORAN KUNJUNGAN UPT PERPUSTAKAAN",
      "UNIVERSITAS NUSA CENDANA",
      `TAHUN ${year}`,
    ];
    titleRows.forEach((text, i) => {
      const row = sheet1.getRow(i + 1);
      row.height = 24;
      sheet1.mergeCells(i + 1, 1, i + 1, 6);
      const cell = row.getCell(1);
      cell.value = text;
      cell.font = { bold: true, size: i === 2 ? 12 : 14 };
      center(cell);
    });

    const headerRow = sheet1.getRow(4);
    headerRow.values = ["NIM", "NAMA MAHASISWA", "HAK AKSES", "PROGRAM STUDI", "DURASI", ""];
    sheet1.mergeCells(4, 5, 4, 6);
    headerRow.height = 22;

    const subHeaderRow = sheet1.getRow(5);
    subHeaderRow.values = ["", "", "", "", "Sesi", "JAM : MENIT"];
    subHeaderRow.height = 20;

    [headerRow, subHeaderRow].forEach(setTableHeader);
    subHeaderRow.eachCell((cell) => {
      if (cell.value) cell.border = THIN_BORDER;
    });

    bookings.forEach((b, idx) => {
      const row = sheet1.getRow(idx + 6);
      const durMin = durationMin(b);
      row.values = [
        b.user.idNumber,
        b.user.name,
        b.user.status,
        b.user.affiliation ?? "",
        b.session.name,
        `${String(Math.floor(durMin / 60)).padStart(2, "0")}:${String(durMin % 60).padStart(2, "0")}`,
      ];
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (idx % 2 === 1) cell.fill = ALT_FILL;
      });
      row.getCell(1).numFmt = "@";
    });

    sheet1.columns.forEach((col, i) => {
      let width = 16;
      if (i === 1) width = 30;
      if (i === 2) width = 14;
      if (i === 3) width = 26;
      if (i === 4) width = 20;
      if (i === 5) width = 14;
      col.width = width;
    });

    // ── Sheet 2: TOTAL ──────────────────────────────────────────────
    const sheet2 = workbook.addWorksheet("TOTAL", {
      properties: { defaultColWidth: 18 },
    });
    sheet2.columns = [{ width: 14 }, { width: 18 }, { width: 28 }, { width: 30 }, { width: 24 }, { width: 22 }];

    sheet2.mergeCells(1, 1, 1, 6);
    const sheet2Title = sheet2.getCell(1, 1);
    sheet2Title.value = "RINGKASAN LAPORAN KUNJUNGAN";
    sheet2Title.fill = TITLE_FILL;
    sheet2Title.font = { bold: true, size: 14 };
    center(sheet2Title);
    sheet2.getRow(1).height = 26;

    // Blok 1: Top 10 kunjungan terbanyak
    const topCount = buildTopByCount(bookings);
    let rowIdx = 3;
    const blok2Title = sheet2.getCell(rowIdx, 1);
    blok2Title.value = "Top 10 Mahasiswa dengan Kunjungan Terbanyak";
    blok2Title.font = { bold: true, size: 12 };
    blok2Title.fill = TITLE_FILL;
    sheet2.mergeCells(rowIdx, 1, rowIdx, 5);
    rowIdx += 1;

    const h2 = sheet2.getRow(rowIdx);
    h2.values = ["PERINGKAT", "NIM", "NAMA", "PROGRAM STUDI", "BANYAK KUNJUNGAN"];
    setTableHeader(h2);
    rowIdx += 1;

    topCount.forEach((t, i) => {
      const row = sheet2.getRow(rowIdx);
      row.values = [i + 1, t.nim, t.name, t.programStudi ?? "", `${t.count} kali`];
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
      row.getCell(2).numFmt = "@";
      rowIdx += 1;
    });
    rowIdx += 1;

    // Blok 3: Top 10 jam kunjungan terlama
    const topDuration = buildTopByDuration(bookings);
    const blok3Title = sheet2.getCell(rowIdx, 1);
    blok3Title.value = "Top 10 Mahasiswa dengan Jam Kunjungan Terlama";
    blok3Title.font = { bold: true, size: 12 };
    blok3Title.fill = TITLE_FILL;
    sheet2.mergeCells(rowIdx, 1, rowIdx, 6);
    rowIdx += 1;

    const h3 = sheet2.getRow(rowIdx);
    h3.values = ["PERINGKAT", "NIM", "NAMA", "PROGRAM STUDI", "TOTAL SESI KUNJUNGAN", "JUMLAH KUNJUNGAN"];
    setTableHeader(h3);
    rowIdx += 1;

    topDuration.forEach((t, i) => {
      const row = sheet2.getRow(rowIdx);
      row.values = [i + 1, t.nim, t.name, t.programStudi ?? "", `${t.totalSessions} sesi`, `${t.visits} kali`];
      row.eachCell((cell) => {
        cell.border = THIN_BORDER;
        if (i % 2 === 1) cell.fill = ALT_FILL;
      });
      row.getCell(2).numFmt = "@";
      rowIdx += 1;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );
    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
