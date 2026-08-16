"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { SpinnerGap, DownloadSimple } from "@phosphor-icons/react";
import { getReportSummary, downloadReport } from "@/lib/api/reports";
import type { ReportSummary } from "@/types/report";

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

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

interface ReportsManagementProps {
  initialSummary: ReportSummary;
}

export function ReportsManagement({ initialSummary }: ReportsManagementProps) {
  const initialYear = Number(initialSummary.month.slice(0, 4));
  const initialMonth = Number(initialSummary.month.slice(5, 7));
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const years = useMemo(() => {
    const years = [];
    for (let y = initialYear - 2; y <= initialYear + 1; y++) years.push(y);
    return years;
  }, [initialYear]);

  const monthParam = useCallback(
    () => `${year}-${String(month).padStart(2, "0")}`,
    [year, month],
  );

  const fetchSummary = async (m: string) => {
    setLoading(true);
    try {
      setSummary(await getReportSummary(m));
    } catch (error) {
      toast.add({
        type: "error",
        title: "Gagal Memuat Laporan",
        description: errorMessage(
          error,
          "Terjadi kesalahan saat memuat data laporan.",
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (value: string | null) => {
    if (!value) return;
    setMonth(Number(value));
    fetchSummary(`${year}-${value}`);
  };

  const handleYearChange = (value: string | null) => {
    if (!value) return;
    setYear(Number(value));
    fetchSummary(`${value}-${String(month).padStart(2, "0")}`);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadReport(monthParam());
      toast.add({
        type: "success",
        title: "Laporan Diunduh",
        description: "File Excel laporan kunjungan berhasil diunduh.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Gagal Mengunduh",
        description: errorMessage(
          error,
          "Terjadi kesalahan saat mengunduh laporan.",
        ),
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Filter Periode ── */}
      <div className="p-5 border border-[#E2E8F0] bg-white rounded-xl shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={String(month)} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS_ID.map((name, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(year)} onValueChange={handleYearChange}>
            <SelectTrigger className="w-full sm:w-[140px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleExport}
          disabled={exporting || loading}
          className="w-full sm:w-auto gap-2 bg-[#0F2018] text-white hover:bg-[#0F2018]/90"
        >
          {exporting ? (
            <SpinnerGap className="w-4 h-4 animate-spin" />
          ) : (
            <DownloadSimple className="w-4 h-4" />
          )}
          Export Excel
        </Button>
      </div>

      {/* ── Total Kunjungan ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-200 shadow-none rounded-xl col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-500">
              Total Kunjungan
            </p>
            <p className="text-4xl font-serif font-bold text-primary mt-2">
              {loading ? "…" : summary.total}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              {summary.monthLabel}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabel Top 10 ── */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-neutral-200 shadow-none rounded-xl">
          <CardHeader className="px-6 py-5 border-b border-neutral-100">
            <CardTitle className="text-base font-serif font-semibold text-primary">
              Top 10 Jam Kunjungan Terlama
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TopDurationTable rows={summary.topByDuration} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TopDurationTable({
  rows,
  loading,
}: {
  rows: ReportSummary["topByDuration"];
  loading: boolean;
}) {
  return (
    <Table className="whitespace-nowrap">
      <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-5 py-3 font-semibold text-neutral-600 h-auto text-center">#</TableHead>
          <TableHead className="px-5 py-3 font-semibold text-neutral-600 h-auto">NIM</TableHead>
          <TableHead className="px-5 py-3 font-semibold text-neutral-600 h-auto">NAMA</TableHead>
          <TableHead className="px-5 py-3 font-semibold text-neutral-600 h-auto">PROGRAM STUDI</TableHead>
          <TableHead className="px-5 py-3 font-semibold text-neutral-600 h-auto text-center">SESI</TableHead>
          <TableHead className="px-5 py-3 font-semibold text-neutral-600 h-auto text-center">KUNJUNGAN</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="py-10 text-center text-neutral-400">
              Memuat data…
            </TableCell>
          </TableRow>
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="py-10 text-center text-neutral-400">
              Tidak ada data kunjungan.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, i) => (
            <TableRow key={row.nim} className="hover:bg-neutral-50/50 transition-colors border-[#E2E8F0]">
              <TableCell className="px-5 py-3 text-center text-neutral-500">{i + 1}</TableCell>
              <TableCell className="px-5 py-3 font-medium text-primary">{row.nim}</TableCell>
              <TableCell className="px-5 py-3 text-neutral-700">{row.name}</TableCell>
              <TableCell className="px-5 py-3 text-neutral-600">{row.programStudi ?? "—"}</TableCell>
              <TableCell className="px-5 py-3 text-center text-neutral-700">{row.totalSessions}</TableCell>
              <TableCell className="px-5 py-3 text-center text-neutral-700">{row.visits}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
