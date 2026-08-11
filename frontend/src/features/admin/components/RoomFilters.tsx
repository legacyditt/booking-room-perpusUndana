"use client";

import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
}

export function RoomFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
}: RoomFiltersProps) {
  return (
    <div className="p-5 border-b border-[#E2E8F0] bg-white flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      {/* ── Kiri: Kolom Pencarian ── */}
      <div className="w-full md:w-96 relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
          <MagnifyingGlass size={18} />
        </div>
        <Input
          type="text"
          placeholder="Cari Nama Ruangan..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 w-full bg-neutral-50/50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-lg"
        />
      </div>

      {/* ── Kanan: Filter Tipe ── */}
      <div className="flex items-center gap-2">
        <Select
          value={type}
          onValueChange={(value) => value && onTypeChange(value)}
        >
          <SelectTrigger className="w-[160px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
            <SelectValue placeholder="Pilih Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua Tipe</SelectItem>
            <SelectItem value="reguler">Reguler</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
