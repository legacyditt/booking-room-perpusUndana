import { ReportsManagement } from "@/features/admin/components/ReportsManagement";
import { getReportSummary } from "@/lib/api/reports";
import { getCookieHeader } from "@/lib/api/server";
import type { ReportSummary } from "@/types/report";

export const dynamic = "force-dynamic";

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export default async function AdminReportsPage() {
  let summary: ReportSummary | null = null;
  try {
    const { cookie } = await getCookieHeader();
    summary = await getReportSummary(currentMonth(), cookie);
  } catch {
    summary = null;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
          Laporan Kunjungan
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Ringkasan kunjungan mahasiswa per bulan, dengan unduhan laporan Excel
          berformat.
        </p>
      </div>

      <ReportsManagement
        initialSummary={
          summary ?? {
            month: currentMonth(),
            monthLabel: "",
            total: 0,
            topByCount: [],
            topByDuration: [],
          }
        }
      />
    </div>
  );
}
