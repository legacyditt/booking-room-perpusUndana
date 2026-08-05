"use client";

import React from "react";
import { Plus } from "@phosphor-icons/react";
import { SessionTable } from "@/features/admin/components/SessionTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { Button } from "@/components/ui/button";

export default function AdminSessionsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Kelola Sesi
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Atur slot waktu sesi yang tersedia untuk pemesanan ruangan.
          </p>
        </div>
        <Button className="bg-[#0F2018] text-white hover:bg-[#0F2018]/90 gap-2">
          <Plus weight="bold" className="w-4 h-4" />
          Tambah Sesi
        </Button>
      </div>

      {/* ── Kontainer Utama (Tabel + Pagination) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Area Tabel Data */}
        <div className="flex-1 min-h-[400px]">
          <SessionTable />
        </div>

        {/* Area Pagination */}
        <div className="p-5 border-t border-[#E2E8F0] bg-white">
          <TablePagination />
        </div>
      </div>
    </div>
  );
}
