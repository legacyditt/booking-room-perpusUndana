"use client";

import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Booking, BookingStatus } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ReservationTableProps {
  bookings: Booking[];
  onUpdateStatus: (id: number, status: BookingStatus) => void;
  isUpdatingId: number | null;
}

// ── Pemetaan status booking ke variant Badge & label ─────────────────────────
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusConfig: Record<BookingStatus, { label: string; variant: BadgeVariant }> = {
  APPROVED: { label: "Disetujui", variant: "default" },
  PENDING: { label: "Menunggu", variant: "outline" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  CANCELLED: { label: "Dibatalkan", variant: "secondary" },
};

export function ReservationTable({
  bookings,
  onUpdateStatus,
  isUpdatingId,
}: ReservationTableProps) {
  return (
    <div className="w-full">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              ID Pemesanan
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Nama Pemesan
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Ruangan
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Tipe
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Tanggal
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Sesi (Waktu)
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Status
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((booking) => {
            const { label, variant } = statusConfig[booking.status];
            const isUpdating = isUpdatingId === booking.id;
            const isSewa = booking.type === "ROOM";

            return (
              <TableRow
                key={booking.id}
                className="hover:bg-neutral-50/50 transition-colors border-[#E2E8F0] text-center"
              >
                  <TableCell className="px-5 py-4 font-medium text-neutral-700">
                    #BKG-{booking.id}
                  </TableCell>
                  <TableCell className="px-5 py-4 font-semibold text-primary">
                    {booking.user?.name ?? "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-neutral-600">
                    {booking.room.name}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    {isSewa ? (
                      <Badge className="bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100 min-w-[70px] justify-center">
                        Sewa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-neutral-500 min-w-[70px] justify-center">
                        Reguler
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-neutral-600">
                    {format(new Date(booking.date), "dd MMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-neutral-600">
                    {booking.session.startTime} - {booking.session.finishTime}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Badge
                        variant={variant}
                        className="min-w-[90px] justify-center"
                      >
                        {label}
                      </Badge>
                      {(booking.status === "APPROVED" || booking.status === "REJECTED") && booking.decidedBy?.name && (
                        <span className="text-[10px] text-neutral-500">
                          Oleh: {booking.decidedBy.name}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    {booking.status === "PENDING" && isSewa ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdatingId !== null}
                          onClick={() => onUpdateStatus(booking.id, "APPROVED")}
                          className="text-primary border-primary/30 hover:bg-primary/5 font-semibold"
                        >
                          {isUpdating ? "Memproses..." : "Setujui"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdatingId !== null}
                          onClick={() => onUpdateStatus(booking.id, "REJECTED")}
                          className="text-red-600 border-red-200 hover:bg-red-50 font-semibold"
                        >
                          Tolak
                        </Button>
                      </div>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
