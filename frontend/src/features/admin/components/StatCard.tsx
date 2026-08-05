import { AdminStat } from "@/types/admin";
import {
  CalendarBlank,
  Hourglass,
  Users,
  ChartPieSlice,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react/dist/ssr";

const iconMap: Record<string, React.ReactNode> = {
  "total-bookings": <CalendarBlank size={22} weight="duotone" />,
  "pending-approvals": <Hourglass size={22} weight="duotone" />,
  "active-users": <Users size={22} weight="duotone" />,
  "room-occupancy": <ChartPieSlice size={22} weight="duotone" />,
};

interface StatCardProps {
  stat: AdminStat;
}

export function StatCard({ stat }: StatCardProps) {
  const icon = iconMap[stat.id];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      {/* Baris atas: Label teks + Ikon */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider leading-tight max-w-[70%]">
          {stat.label}
        </p>
        {/* Ikon dalam lingkaran warna muted */}
        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
      </div>

      {/* Nilai utama (angka besar) */}
      <p className="text-4xl font-serif font-bold text-primary tracking-tight">
        {stat.value}
      </p>

      {/* Bagian bawah: Bisa berupa trend, subtext, atau progress bar */}
      <div className="mt-auto">
        {/* Jika ada data progress → tampilkan progress bar */}
        {stat.progress !== undefined ? (
          <div className="space-y-1.5">
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ) : stat.trend ? (
          // Jika ada data trend → tampilkan teks trend dengan warna positif/negatif
          <div className={`flex items-center gap-1 text-xs font-medium ${
            stat.trendPositive ? "text-emerald-600" : "text-destructive"
          }`}>
            {stat.trendPositive
              ? <TrendUp size={14} weight="bold" />
              : <TrendDown size={14} weight="bold" />
            }
            <span>{stat.trend}</span>
          </div>
        ) : (
          // Fallback: tampilkan subtext biasa
          <p className="text-xs text-neutral-400">{stat.subtext}</p>
        )}
      </div>
    </div>
  );
}
