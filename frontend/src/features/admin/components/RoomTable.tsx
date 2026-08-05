"use client";

import React from "react";
import Image from "next/image";
import { DotsThree, BookOpen, Users, Desktop, PresentationChart } from "@phosphor-icons/react";
import { mockAdminRooms } from "@/data/mock";
import { AdminRoomRow } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// ── Status Config ──
const statusConfig: Record<AdminRoomRow["status"], { label: string; dotColor: string }> = {
  AVAILABLE: { label: "Tersedia", dotColor: "bg-emerald-500" },
  MAINTENANCE: { label: "Perawatan", dotColor: "bg-red-500" },
  OFFLINE: { label: "Tidak Aktif", dotColor: "bg-neutral-400" },
};

// Helper Icon berdasarkan tipe
function getTypeIcon(type: string) {
  if (type.includes("Study")) return <BookOpen className="w-3.5 h-3.5" />;
  if (type.includes("Seminar")) return <Users className="w-3.5 h-3.5" />;
  if (type.includes("Computer")) return <Desktop className="w-3.5 h-3.5" />;
  return <PresentationChart className="w-3.5 h-3.5" />;
}

export function RoomTable() {
  return (
    <div className="w-full">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto w-[300px] text-center">NAMA RUANGAN</TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">TIPE</TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">KAPASITAS</TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">HARGA / SESI</TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">STATUS</TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mockAdminRooms.map((room) => {
            const status = statusConfig[room.status];

            return (
              <TableRow key={room.id} className="hover:bg-neutral-50/50 transition-colors group border-[#E2E8F0] text-center">
                {/* Kolom Nama & Gambar */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image src={room.imageUrl} alt={room.roomName} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{room.roomName}</span>
                      <span className="text-xs text-neutral-500">{room.location}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Kolom Tipe */}
                <TableCell className="px-5 py-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-medium">
                    {getTypeIcon(room.type)}
                    {room.type}
                  </div>
                </TableCell>

                {/* Kolom Kapasitas */}
                <TableCell className="px-5 py-4 text-neutral-600">
                  {room.capacity}
                </TableCell>

                {/* Kolom Harga */}
                <TableCell className="px-5 py-4 text-neutral-600">
                  {room.price}
                </TableCell>

                {/* Kolom Status */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
                    {status.label}
                  </div>
                </TableCell>

                {/* Kolom Aksi */}
                <TableCell className="px-5 py-4 text-center">
                  <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-primary w-8 h-8">
                    <DotsThree weight="bold" size={24} />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
