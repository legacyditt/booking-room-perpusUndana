import ExcelJS from "exceljs";

export const MONTHS_ID = [
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

export const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF0F2018" },
};

export const TITLE_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE7EDE9" },
};

export const ALT_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF7F9F8" },
};

export const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  bottom: { style: "thin" },
  left: { style: "thin" },
  right: { style: "thin" },
};

export const center = (cell: ExcelJS.Cell) => {
  cell.alignment = { horizontal: "center", vertical: "middle" };
};

export const setTableHeader = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });
};

export const formatDate = (date: Date) => {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = MONTHS_ID[date.getUTCMonth()];
  return `${day}/${month}/${date.getUTCFullYear()}`;
};

export const formatDateTime = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_ID[date.getMonth()];
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()} ${hour}:${minute}`;
};