"use client";

import React from "react";
import { DownloadIcon } from "@phosphor-icons/react";
import { ReservationFilters } from "@/features/admin/components/ReservationFilters";
import { ReservationTable } from "@/features/admin/components/ReservationTable";

export default function AdminReservationsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Kelola Pemesanan Ruangan Perpustakaan Undana
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Tinjau dan kelola jadwal pemesanan ruangan perpustakaan.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0F2018] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#0F2018]/90 transition-colors">
          <DownloadIcon className="w-4 h-4" />
          Ekspor Laporan
        </button>
      </div>

      {/* ── Kontainer Utama (Filter, Tabel, Pagination) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <ReservationFilters />

        {/* Area Tabel Data */}
        <div className="flex-1 min-h-[400px]">
          <ReservationTable />
        </div>

        {/* Placeholder: Pagination */}
        <div className="p-5 border-t border-[#E2E8F0] bg-white flex justify-between items-center">
          <p className="text-sm text-neutral-400 italic">
            -- Area Pagination --
          </p>
        </div>
      </div>
    </div>
  );
}
