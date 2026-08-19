import { useQuery } from "@tanstack/react-query";
import { getReportSummary } from "@/lib/api/reports";
import type { ReportSummary } from "@/types/report";
import { queryKeys } from "@/lib/query-keys";

export function useReportSummary(month: string, initialData?: ReportSummary) {
  return useQuery({
    queryKey: queryKeys.reports.summary(month),
    queryFn: () => getReportSummary(month),
    staleTime: 5 * 60 * 1000,
    enabled: !!month,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}