"use client"

import React from "react";
import { MagnifyingGlass, DownloadSimple } from "@phosphor-icons/react";

export function ReservationFilters() {
  return (
    <div className="p-5 border-b border-[#E2E8F0] bg-white">
      <div className="flex flex-col xl:flex-row gap-4 items-end">
        
        {/* Grup Form Filter (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
          
          {/* Pencarian */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Cari Pemesanan
            </label>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari ID, Nama..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Status
            </label>
            <select className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors appearance-none">
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>

          {/* Tanggal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Rentang Tanggal
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          {/* Tipe Ruangan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Tipe Ruangan
            </label>
            <select className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors appearance-none">
              <option value="all">Semua Ruangan</option>
              <option value="regular">Reguler</option>
              <option value="premium">Premium</option>
              <option value="discussion">Ruang Diskusi</option>
            </select>
          </div>
          
        </div>

        {/* Tombol Export Filter */}
        <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors w-full xl:w-auto h-[38px]">
          <DownloadSimple className="w-4 h-4" />
          Ekspor
        </button>
      </div>
    </div>
  );
}
