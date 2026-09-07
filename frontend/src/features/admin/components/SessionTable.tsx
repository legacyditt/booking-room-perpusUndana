"use client";

import React from "react";
import Link from "next/link";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { Session } from "@/types/booking";
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

interface SessionTableProps {
  sessions: Session[];
  onDelete: (session: Session) => void;
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const formatDuration = (startTime: string, finishTime: string) => {
  const diff = (toMinutes(finishTime) - toMinutes(startTime) + 1440) % 1440;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0 && m > 0) return `${h} Jam ${m} Menit`;
  if (h > 0) return `${h} Jam`;
  return `${m} Menit`;
};

export function SessionTable({ sessions, onDelete }: SessionTableProps) {
  return (
    <div className="w-full">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              NAMA SESI
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              WAKTU MULAI
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              WAKTU SELESAI
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              DURASI
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              DIBUAT OLEH
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              DIEDIT OLEH
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              AKSI
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sessions.map((session) => (
            <TableRow
              key={session.id}
              className="hover:bg-neutral-50/50 transition-colors border-[#E2E8F0]"
            >
              {/* Kolom Nama Sesi (Rata Kiri) */}
              <TableCell className="px-5 py-4">
                <span className="font-semibold text-primary">
                  {session.name}
                </span>
              </TableCell>

              {/* Kolom Waktu Mulai */}
              <TableCell className="px-5 py-4 text-neutral-600 text-center">
                {session.startTime}
              </TableCell>

              {/* Kolom Waktu Selesai */}
              <TableCell className="px-5 py-4 text-neutral-600 text-center">
                {session.finishTime}
              </TableCell>

              {/* Kolom Durasi */}
              <TableCell className="px-5 py-4 text-center">
                <Badge
                  variant="outline"
                  className="min-w-[60px] justify-center"
                >
                  {formatDuration(session.startTime, session.finishTime)}
                </Badge>
              </TableCell>

              {/* Kolom Dibuat Oleh */}
              <TableCell className="px-5 py-4 text-neutral-600 text-center">
                {session.createdBy?.name || "-"}
              </TableCell>

              {/* Kolom Diedit Oleh */}
              <TableCell className="px-5 py-4 text-neutral-600 text-center">
                {session.updatedBy?.name || "-"}
              </TableCell>

              {/* Kolom Aksi: Edit + Hapus */}
              <TableCell className="px-5 py-4">
                <div className="flex items-center justify-center gap-1">
                  <Link href={`/admin/sessions/${session.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Edit Sesi"
                    >
                      <PencilSimple weight="bold" size={18} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-destructive w-8 h-8"
                    title="Hapus Sesi"
                    onClick={() => onDelete(session)}
                  >
                    <Trash weight="bold" size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
