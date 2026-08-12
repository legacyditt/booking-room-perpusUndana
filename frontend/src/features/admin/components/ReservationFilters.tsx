"use client";

import React from "react";
import { MagnifyingGlass, DownloadSimple } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReservationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
}

export function ReservationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  date,
  onDateChange,
  type,
  onTypeChange,
}: ReservationFiltersProps) {
  return (
    <div className="p-5 border-b border-[#E2E8F0] bg-white">
      <div className="flex flex-col xl:flex-row gap-4 items-end">
        {/* Grup Form Filter (Flex) */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
          {/* Pencarian */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Cari Pemesanan
            </label>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 z-10" />
              <Input
                type="text"
                placeholder="Cari ID, Nama..."
                className="pl-9"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1.5 w-full md:w-[160px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Status
            </label>
            <Select value={status} onValueChange={(v) => v && onStatusChange(v)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {({
                    Semua: "Semua Status",
                    PENDING: "Menunggu",
                    APPROVED: "Disetujui",
                    REJECTED: "Ditolak",
                    CANCELLED: "Dibatalkan"
                  }[status] ?? "Pilih Status")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tanggal */}
          <div className="flex flex-col gap-1.5 w-full md:w-[160px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Rentang Tanggal
            </label>
            <Input
              type="date"
              className="w-full"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>

          {/* Tipe Ruangan Dropdown */}
          <div className="flex flex-col gap-1.5 w-full md:w-[160px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Tipe Ruangan
            </label>
            <Select value={type} onValueChange={(v) => v && onTypeChange(v)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {({
                    Semua: "Semua Ruangan",
                    reguler: "Reguler",
                    sewa: "Sewa"
                  }[type] ?? "Pilih Tipe Ruangan")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Ruangan</SelectItem>
                <SelectItem value="reguler">Reguler</SelectItem>
                <SelectItem value="sewa">Sewa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tombol Export Filter */}
        <Button variant="outline" className="w-full xl:w-auto flex gap-2">
          <DownloadSimple className="w-4 h-4" />
          Ekspor
        </Button>
      </div>
    </div>
  );
}
