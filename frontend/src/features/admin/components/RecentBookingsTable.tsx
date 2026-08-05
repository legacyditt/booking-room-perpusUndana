import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { RecentBookingRow } from "@/types/admin";

// ── Pemetaan status booking ke variant Badge & label ─────────────────────────
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusConfig: Record<
  RecentBookingRow["status"],
  { label: string; variant: BadgeVariant }
> = {
  APPROVED: { label: "Disetujui", variant: "default" },
  PENDING: { label: "Menunggu", variant: "outline" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  CANCELLED: { label: "Dibatalkan", variant: "secondary" },
};

interface RecentBookingsTableProps {
  bookings: RecentBookingRow[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 flex flex-col">
      {/* Header tabel */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
        <h2 className="text-lg font-serif font-semibold text-primary">
          Peminjaman Terbaru
        </h2>
        <Link
          href="/admin/bookings"
          className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-primary transition-colors"
        >
          Lihat Semua
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header kolom */}
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Nama Peminjam
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Ruangan
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Sesi
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          {/* Isi tabel */}
          <tbody className="divide-y divide-neutral-100">
            {bookings.map((booking) => {
              // Ambil konfigurasi badge berdasarkan status booking
              const { label, variant } = statusConfig[booking.status];

              return (
                <tr
                  key={booking.id}
                  className="hover:bg-neutral-50/60 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-primary">
                    {booking.userName}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {booking.roomName}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 tabular-nums">
                    {booking.sessionTimeRange}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={variant} className="min-w-[90px] justify-center">{label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
