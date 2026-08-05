"use client";

import React from "react";
import { Eye, PencilSimple } from "@phosphor-icons/react";
import { mockRecentBookings } from "@/data/mock";
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

export function ReservationTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        {/* Table Header */}
        <thead className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <tr>
            <th className="px-5 py-4 font-semibold text-neutral-600">ID Pemesanan</th>
            <th className="px-5 py-4 font-semibold text-neutral-600">Nama Pemesan</th>
            <th className="px-5 py-4 font-semibold text-neutral-600">Ruangan</th>
            <th className="px-5 py-4 font-semibold text-neutral-600">Tanggal</th>
            <th className="px-5 py-4 font-semibold text-neutral-600">Sesi (Waktu)</th>
            <th className="px-5 py-4 font-semibold text-neutral-600">Status</th>
            <th className="px-5 py-4 font-semibold text-neutral-600 text-center">Aksi</th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="divide-y divide-[#E2E8F0]">
          {mockRecentBookings.map((booking) => {
            // Ambil konfigurasi label dan variant warna dari map statusConfig
            const { label, variant } = statusConfig[booking.status];

            return (
              <tr key={booking.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-5 py-4 font-medium text-neutral-700">
                  #BKG-889{booking.id}
                </td>
                <td className="px-5 py-4 font-semibold text-primary">
                  {booking.userName}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {booking.roomName}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {booking.date}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {booking.sessionTimeRange}
                </td>
                <td className="px-5 py-4">
                  <Badge 
                    variant={variant} 
                    className="min-w-[90px] justify-center"
                  >
                    {label}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      className="text-neutral-400 hover:text-primary transition-colors focus:outline-none"
                      title="Lihat Detail"
                    >
                      <Eye weight="bold" size={18} />
                    </button>
                    <button 
                      className="text-neutral-400 hover:text-primary transition-colors focus:outline-none"
                      title="Edit Pemesanan"
                    >
                      <PencilSimple weight="bold" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
