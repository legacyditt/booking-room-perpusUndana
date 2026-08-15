import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking, BookingStatus } from "@/types/booking";
import { isSeatApproved } from "@/lib/booking-status";

// ── Pemetaan status booking ke variant Badge & label ─────────────────────────
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusConfig: Record<BookingStatus, { label: string; variant: BadgeVariant }> = {
  APPROVED: { label: "Disetujui", variant: "default" },
  PENDING: { label: "Menunggu", variant: "outline" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  CANCELLED: { label: "Dibatalkan", variant: "secondary" },
};

interface RecentBookingsTableProps {
  bookings: Booking[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden">
      {/* Header tabel */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
        <h2 className="text-lg font-serif font-semibold text-primary">
          Penyewaan Ruang Terbaru
        </h2>
        <Link
          href="/admin/reservations"
          className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-primary transition-colors"
        >
          Lihat Semua
          <ArrowRight size={14} />
        </Link>
      </div>

      <Table>
        <TableHeader className="bg-neutral-50/50">
          <TableRow className="hover:bg-transparent border-neutral-100">
            <TableHead className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider h-auto text-center">
              Nama Peminjam
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider h-auto text-center">
              Ruangan
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider h-auto text-center">
              Sesi
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider h-auto text-center">
              Tanggal
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider h-auto text-center">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((booking) => {
            const { label, variant } = statusConfig[booking.status];
            const displayLabel = isSeatApproved(booking) ? "Dipesan" : label;
            const displayVariant = isSeatApproved(booking)
              ? "secondary"
              : variant;

            return (
              <TableRow
                key={booking.id}
                className="hover:bg-neutral-50/60 transition-colors border-neutral-100 text-center"
              >
                <TableCell className="px-6 py-4 font-medium text-primary">
                  {booking.user?.name ?? "-"}
                </TableCell>
                <TableCell className="px-6 py-4 text-neutral-600">
                  {booking.room.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-neutral-600 tabular-nums">
                  {booking.session.startTime} - {booking.session.finishTime}
                </TableCell>
                <TableCell className="px-6 py-4 text-neutral-500">
                  {format(new Date(booking.date), "dd MMM yyyy", { locale: id })}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant={displayVariant}
                    className="min-w-[90px] justify-center"
                  >
                    {displayLabel}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
