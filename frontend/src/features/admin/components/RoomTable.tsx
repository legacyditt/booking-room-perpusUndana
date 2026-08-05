"use client";
import React from "react";
import {
  Eye,
  PencilSimple,
  BookOpen,
  Users,
  Desktop,
  PresentationChart,
} from "@phosphor-icons/react";
import { mockAdminRooms } from "@/data/mock";
import { AdminRoomRow } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

// ── Status Config ──
const statusConfig: Record<
  AdminRoomRow["status"],
  { label: string; variant: BadgeVariant }
> = {
  AVAILABLE: { label: "Tersedia", variant: "default" },
  MAINTENANCE: { label: "Perawatan", variant: "destructive" },
  OFFLINE: { label: "Tidak Aktif", variant: "secondary" },
};

// Helper Icon berdasarkan tipe
function getTypeIcon(type: string) {
  if (type.includes("Study") || type.includes("Reguler"))
    return <BookOpen className="w-3.5 h-3.5" />;
  if (type.includes("Seminar") || type.includes("Premium"))
    return <Users className="w-3.5 h-3.5" />;
  if (type.includes("Computer")) return <Desktop className="w-3.5 h-3.5" />;
  return <PresentationChart className="w-3.5 h-3.5" />;
}

export function RoomTable() {
  return (
    <div className="w-full">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              NAMA RUANGAN
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              TIPE
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              KAPASITAS
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              HARGA / SESI
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              STATUS
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              AKSI
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mockAdminRooms.map((room) => {
            const status = statusConfig[room.status];

            return (
              <TableRow
                key={room.id}
                className="hover:bg-neutral-50/50 transition-colors group border-[#E2E8F0]"
              >
                {/* Kolom Nama Ruangan */}
                <TableCell className="px-5 py-4">
                  <div className="flex flex-col gap-0.5 items-center text-center">
                    <span className="font-semibold text-primary">
                      {room.roomName}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {room.location}
                    </span>
                  </div>
                </TableCell>

                {/* Kolom Tipe */}
                <TableCell className="px-5 py-4 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-medium">
                    {getTypeIcon(room.type)}
                    {room.type}
                  </div>
                </TableCell>

                {/* Kolom Kapasitas */}
                <TableCell className="px-5 py-4 text-neutral-600 text-center">
                  {room.capacity}
                </TableCell>

                {/* Kolom Harga */}
                <TableCell className="px-5 py-4 text-neutral-600 text-center">
                  {room.price}
                </TableCell>

                {/* Kolom Status */}
                <TableCell className="px-5 py-4 text-center">
                  <Badge
                    variant={status.variant}
                    className="min-w-[90px] justify-center"
                  >
                    {status.label}
                  </Badge>
                </TableCell>

                {/* Kolom Aksi (Eye & Pencil) */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Lihat Detail Ruangan"
                    >
                      <Eye weight="bold" size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Edit Ruangan"
                    >
                      <PencilSimple weight="bold" size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
