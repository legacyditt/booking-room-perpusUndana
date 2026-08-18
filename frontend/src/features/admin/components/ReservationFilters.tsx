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

interface ReservationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onClearDate: () => void;
  type: string;
  onTypeChange: (value: string) => void;
}

export function ReservationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearDate,
  type,
  onTypeChange,
}: ReservationFiltersProps) {
  const handleStartDateChange = (val: string) => {
    onStartDateChange(val);
    // Jika endDate kosong atau lebih kecil dari startDate baru, otomatis samakan endDate
    if (!endDate || endDate < val) {
      onEndDateChange(val);
    }
  };

  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <div className="p-5 border-b border-[#E2E8F0] bg-white">
      <div className="flex flex-col xl:flex-row gap-4 items-end">
        {/* Grup Form Filter (Flex) */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full flex-wrap items-end">
          {/* Pencarian */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Cari Pemesanan
            </label>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 z-10" />
              <Input
                type="text"
                placeholder="Cari ID, Nama..."
                className="pl-9 h-10"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Status
            </label>
            <Select value={status} onValueChange={(v) => v && onStatusChange(v)}>
              <SelectTrigger className="w-full h-10">
                <SelectValue>
                  {({
                    Semua: "Semua Status",
                    PENDING: "Menunggu",
                    APPROVED: "Disetujui",
                    DIPESAN: "Dipesan",
                    REJECTED: "Ditolak",
                    CANCELLED: "Dibatalkan",
                  }[status] ?? "Pilih Status")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="DIPESAN">Dipesan</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipe Ruangan Dropdown */}
          <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Tipe Ruangan
            </label>
            <Select value={type} onValueChange={(v) => v && onTypeChange(v)}>
              <SelectTrigger className="w-full h-10">
                <SelectValue>
                  {({
                    Semua: "Semua Ruangan",
                    reguler: "Reguler",
                    sewa: "Sewa",
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

          {/* Rentang Tanggal (Dari - Sampai) */}
          <div className="flex flex-col gap-1.5 w-full lg:w-auto">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Rentang Tanggal
              </label>
              {hasDateFilter && (
                <button
                  type="button"
                  onClick={onClearDate}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Reset Tanggal
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="w-full sm:w-[140px] h-10"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                placeholder="Dari"
              />
              <span className="text-neutral-400 text-sm">-</span>
              <Input
                type="date"
                className="w-full sm:w-[140px] h-10"
                value={endDate}
                min={startDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                placeholder="Sampai"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
