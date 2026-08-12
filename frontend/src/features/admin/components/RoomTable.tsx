"use client";

import React from "react";
import Link from "next/link";
import { PencilSimple, Trash, BookOpen, Users, Star } from "@phosphor-icons/react";
import { Room } from "@/types/room";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

interface RoomTableProps {
  rooms: Room[];
  onDelete: (room: Room) => void;
}

export function RoomTable({ rooms, onDelete }: RoomTableProps) {
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
              AKSI
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room) => {
            const isSewa = !!room.bookingPrice;
            const price = room.bookingPrice
              ? rupiahFormatter.format(Number(room.bookingPrice.price))
              : "Gratis";

            return (
              <TableRow
                key={room.id}
                className="hover:bg-neutral-50/50 transition-colors group border-[#E2E8F0]"
              >
                {/* Kolom Nama Ruangan */}
                <TableCell className="px-5 py-4">
                  <div className="flex flex-col gap-0.5 items-center text-center">
                    <span className="font-semibold text-primary">
                      {room.name}
                    </span>
                  </div>
                </TableCell>

                {/* Kolom Tipe */}
                <TableCell className="px-5 py-4 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-medium">
                    {isSewa ? (
                      <Star className="w-3.5 h-3.5" weight="fill" />
                    ) : (
                      <BookOpen className="w-3.5 h-3.5" />
                    )}
                    {isSewa ? "Sewa" : "Reguler"}
                  </div>
                </TableCell>

                {/* Kolom Kapasitas */}
                <TableCell className="px-5 py-4 text-neutral-600 text-center">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {room.capacity} Orang
                  </span>
                </TableCell>

                {/* Kolom Harga */}
                <TableCell className="px-5 py-4 text-neutral-600 text-center">
                  {price}
                </TableCell>

                {/* Kolom Aksi (Edit & Hapus) */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Link href={`/admin/rooms/${room.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-primary w-8 h-8"
                        title="Edit Ruangan"
                      >
                        <PencilSimple weight="bold" size={18} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-destructive w-8 h-8"
                      title="Hapus Ruangan"
                      onClick={() => onDelete(room)}
                    >
                      <Trash weight="bold" size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {rooms.length === 0 && (
        <div className="py-16 text-center text-neutral-500">
          <p className="text-lg">Tidak ada ruangan yang cocok.</p>
        </div>
      )}
    </div>
  );
}
