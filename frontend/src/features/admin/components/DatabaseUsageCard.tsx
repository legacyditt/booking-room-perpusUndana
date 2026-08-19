"use client";

import { Database, HardDrives } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DatabaseStats } from "@/types/database";
import { useDatabaseStats } from "@/lib/hooks/use-database-stats";

interface DatabaseUsageCardProps {
  stats?: DatabaseStats;
}

export function DatabaseUsageCard({ stats }: DatabaseUsageCardProps) {
  const { data } = useDatabaseStats(stats);

  // Nilai default jika data belum termuat
  const usedFormatted = data?.usedFormatted ?? "12.8 MB";
  const maxFormatted = data?.maxFormatted ?? "512 MB";
  const percentage = data?.percentage ?? 2.5;

  // Penentuan warna indikator berdasarkan persentase penggunaan storage
  const getStatusColor = (pct: number) => {
    if (pct >= 90) {
      return {
        bar: "bg-rose-500",
        dot: "bg-rose-500",
        text: "text-rose-600",
        label: "Kritis",
      };
    }
    if (pct >= 70) {
      return {
        bar: "bg-amber-500",
        dot: "bg-amber-500",
        text: "text-amber-600",
        label: "Penuh",
      };
    }
    return {
      bar: "bg-primary",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      label: "Normal",
    };
  };

  const status = getStatusColor(percentage);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-neutral-200 shadow-none rounded-xl">
      <CardContent className="p-5 flex flex-col justify-between h-full gap-3">
        {/* Baris atas: Label teks + Ikon */}
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider leading-tight max-w-[70%]">
            PENGGUNAAN DATABASE
          </p>
          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-primary shrink-0">
            <Database size={22} weight="duotone" />
          </div>
        </div>

        {/* Nilai utama: Pemakaian storage saat ini */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-serif font-bold text-primary tracking-tight">
            {usedFormatted}
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            / {maxFormatted}
          </span>
        </div>

        {/* Progress Bar & Status Footer */}
        <div className="space-y-2 pt-1">
          <Progress
            value={percentage}
            max={100}
            className="h-2 bg-neutral-100"
            indicatorClassName={status.bar}
          />

          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-medium">{percentage}% terpakai</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
              <span className={status.text}>{status.label}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
