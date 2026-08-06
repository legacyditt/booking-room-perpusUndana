"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { RoomFilters } from "@/features/admin/components/RoomFilters";
import { RoomTable } from "@/features/admin/components/RoomTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { Button } from "@/components/ui/button";

export default function AdminRoomsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Kelola Ruangan
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Awasi dan pelihara inventaris seluruh fasilitas akademik perpustakaan.
          </p>
        </div>
        <Link href="/admin/rooms/add">
          <Button className="bg-[#0F2018] text-white hover:bg-[#0F2018]/90 gap-2">
            <Plus className="w-4 h-4" weight="bold" />
            Tambah Ruangan
          </Button>
        </Link>
      </div>

      {/* ── Kontainer Utama (Filter, Tabel, Pagination) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <RoomFilters />

        {/* Area Tabel Data */}
        <div className="flex-1 min-h-[400px]">
          <RoomTable />
        </div>
        
        {/* Area Pagination */}
        <div className="p-5 border-t border-[#E2E8F0] bg-white">
          <TablePagination />
        </div>
      </div>
    </div>
  );
}
