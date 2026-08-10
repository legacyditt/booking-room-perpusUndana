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

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  category,
  onCategoryChange,
}: UserFiltersProps) {
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
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 w-full bg-neutral-50/50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-lg"
        />
      </div>

      {/* ── Kanan: Filter Dropdowns & Sort ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <Select
            value={role}
            onValueChange={(value) => value && onRoleChange(value)}
          >
            <SelectTrigger className="w-[160px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue placeholder="Pilih Peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Peran</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">Pengguna</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={category}
            onValueChange={(value) => value && onCategoryChange(value)}
          >
            <SelectTrigger className="w-[160px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Kategori</SelectItem>
              <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
              <SelectItem value="dosen">Dosen</SelectItem>
              <SelectItem value="umum">Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
