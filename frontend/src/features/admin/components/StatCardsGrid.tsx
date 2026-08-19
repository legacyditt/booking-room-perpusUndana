import { StatCard } from "./StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { getBookings } from "@/lib/api";
import type { AdminStat } from "@/types/admin";
import type { Booking } from "@/types/booking";
import { isSameMonth, isToday, parseISO } from "date-fns";

interface StatCardsGridProps {
  cookie?: string;
}

export async function StatCardsGrid({ cookie }: StatCardsGridProps) {
  const bookings = await getBookings(cookie).catch(() => [] as Booking[]);

  const stats: AdminStat[] = [
    {
      id: "total-bookings",
      label: "Total Booking Hari Ini",
      value: bookings.filter((b) => isToday(parseISO(b.date))).length,
    },
    {
      id: "pending-approvals",
      label: "Menunggu Persetujuan",
      value: bookings.filter((b) => b.status === "PENDING").length,
    },
    {
      id: "approved-this-month",
      label: "Booking Disetujui Bulan Ini",
      value: bookings.filter(
        (b) => b.status === "APPROVED" && isSameMonth(parseISO(b.date), new Date())
      ).length,
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </>
  );
}

export function StatCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-neutral-200 shadow-none rounded-xl">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="w-24 h-3 rounded bg-neutral-200 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-neutral-100 animate-pulse" />
            </div>
            <div className="w-16 h-9 rounded bg-neutral-200 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}