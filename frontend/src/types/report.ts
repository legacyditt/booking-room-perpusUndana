export interface ReportTopRow {
  nim: string;
  name: string;
  programStudi: string | null;
  count: number;
}

export interface ReportDurationRow {
  nim: string;
  name: string;
  programStudi: string | null;
  totalSessions: number;
  visits: number;
}

export interface ReportSummary {
  month: string;
  monthLabel: string;
  total: number;
  topByCount: ReportTopRow[];
  topByDuration: ReportDurationRow[];
}
