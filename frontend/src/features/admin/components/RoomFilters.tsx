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

export function RoomFilters() {
  return (
    <div className="p-5 border-b border-[#E2E8F0] bg-white">
      <div className="flex flex-col xl:flex-row gap-4 items-end">
        {/* Grup Form Filter */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
          {/* Pencarian */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Cari Ruangan
            </label>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 z-10" />
              <Input
                type="text"
                placeholder="Cari Nama Ruangan..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1.5 w-full md:w-[160px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Status
            </label>
            <Select defaultValue="Semua">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Status</SelectItem>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="maintenance">Perawatan</SelectItem>
                <SelectItem value="offline">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipe Ruangan Dropdown */}
          <div className="flex flex-col gap-1.5 w-full md:w-[160px]">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Tipe Ruangan
            </label>
            <Select defaultValue="Semua">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tipe Ruangan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Tipe</SelectItem>
                <SelectItem value="reguler">Reguler</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
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
