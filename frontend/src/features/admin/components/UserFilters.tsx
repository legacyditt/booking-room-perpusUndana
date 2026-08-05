"use client";

import React from "react";
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserFilters() {
  return (
    <div className="p-5 border-b border-[#E2E8F0] bg-white flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      {/* ── Kiri: Kolom Pencarian ── */}
      <div className="w-full md:w-96 relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
          <MagnifyingGlass size={18} />
        </div>
        <Input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          className="pl-10 h-10 w-full bg-neutral-50/50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-lg"
        />
      </div>

      {/* ── Kanan: Filter Dropdowns & Sort ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue placeholder="Pilih Peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Peran</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="librarian">Pustakawan</SelectItem>
              <SelectItem value="user">Pengguna</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
              <SelectItem value="suspended">Ditangguhkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 border-neutral-200 text-neutral-500 hover:text-primary hover:border-primary transition-colors rounded-lg"
          title="Filter Lanjutan"
        >
          <FunnelSimple size={18} />
        </Button>
      </div>
    </div>
  );
}
