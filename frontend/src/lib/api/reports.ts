import { client, unwrap } from "./client";
import type { ReportSummary } from "@/types/report";

const monthParam = (month: string) => ({ params: { month } });

export function getReportSummary(
  month: string,
  cookie?: string,
): Promise<ReportSummary> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/reports/summary", { ...monthParam(month), headers }));
}

export async function downloadReport(month: string): Promise<void> {
  const res = await client.get("/reports/export", {
    ...monthParam(month),
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `KUNJUNGAN_${monthLabel(month).toUpperCase()}_TAHUN_${month.slice(0, 4)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function monthLabel(month: string) {
  const [, m] = month.split("-").map(Number);
  return MONTHS_ID[(m ?? 1) - 1] ?? "";
}
