import { AdminStat } from "@/types/admin";
import {
  CalendarBlank,
  Hourglass,
  CheckCircle,
  Door,
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, React.ReactNode> = {
  "total-bookings": <CalendarBlank size={22} weight="duotone" />,
  "pending-approvals": <Hourglass size={22} weight="duotone" />,
  "approved-this-month": <CheckCircle size={22} weight="duotone" />,
  "total-rooms": <Door size={22} weight="duotone" />,
};

interface StatCardProps {
  stat: AdminStat;
}

export function StatCard({ stat }: StatCardProps) {
  const icon = iconMap[stat.id];

  return (
    <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-neutral-200 shadow-none rounded-xl">
      <CardContent className="p-5 flex flex-col gap-3 h-full">
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider leading-tight max-w-[70%]">
            {stat.label}
          </p>
          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-primary shrink-0">
            {icon}
          </div>
        </div>

        <p className="text-4xl font-serif font-bold text-primary tracking-tight">
          {stat.value}
        </p>
      </CardContent>
    </Card>
  );
}

