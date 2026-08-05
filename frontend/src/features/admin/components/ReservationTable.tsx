"use client";

import React from "react";
import { Eye, PencilSimple } from "@phosphor-icons/react";
import { mockRecentBookings } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecentBookingRow } from "@/types/admin";
import { Button } from "@/components/ui/button";

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

export function ReservationTable() {
  return (
    <div className="w-full">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              ID Pemesanan
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              Nama Pemesan
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              Ruangan
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              Tanggal
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              Sesi (Waktu)
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              Status
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mockRecentBookings.map((booking) => {
            const { label, variant } = statusConfig[booking.status];

            return (
              <TableRow
                key={booking.id}
                className="hover:bg-neutral-50/50 transition-colors group border-[#E2E8F0]"
              >
                <TableCell className="px-5 py-4 font-medium text-neutral-700">
                  #BKG-889{booking.id}
                </TableCell>
                <TableCell className="px-5 py-4 font-semibold text-primary">
                  {booking.userName}
                </TableCell>
                <TableCell className="px-5 py-4 text-neutral-600">
                  {booking.roomName}
                </TableCell>
                <TableCell className="px-5 py-4 text-neutral-600">
                  {booking.date}
                </TableCell>
                <TableCell className="px-5 py-4 text-neutral-600">
                  {booking.sessionTimeRange}
                </TableCell>
                <TableCell className="px-5 py-4">
                  <Badge
                    variant={variant}
                    className="min-w-[90px] justify-center rounded-md"
                  >
                    {label}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Lihat Detail"
                    >
                      <Eye weight="bold" size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Edit Pemesanan"
                    >
                      <PencilSimple weight="bold" size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
