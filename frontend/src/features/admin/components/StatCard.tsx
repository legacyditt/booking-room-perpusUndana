import { AdminStat } from "@/types/admin";
import {
  CalendarBlank,
  Hourglass,
  Users,
  ChartPieSlice,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent } from "@/components/ui/card"; 

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
    <Card className="hover:shadow-md transition-shadow duration-200 border-neutral-200 shadow-none rounded-xl">
      <CardContent className="p-5 flex flex-col gap-3 h-full">
        {/* Baris atas: Label teks + Ikon */}
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider leading-tight max-w-[70%]">
            {stat.label}
          </p>
          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-primary shrink-0">
            {icon}
          </div>
        </div>

        {/* Nilai utama (angka besar) */}
        <p className="text-4xl font-serif font-bold text-primary tracking-tight">
          {stat.value}
        </p>

        {/* Bagian bawah */}
        <div className="mt-auto pt-2">
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
            <p className="text-xs text-neutral-400">{stat.subtext}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
