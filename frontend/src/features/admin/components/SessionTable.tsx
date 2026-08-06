"use client";

import React from "react";
import Link from "next/link";
import { Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import { mockAdminSessions } from "@/data/mock";
import { AdminSessionRow } from "@/types/admin";
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

// ── BadgeVariant adalah union type dari varian Badge shadcn ──
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

// ── Config Badge status sesi ──
const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  active: { label: "Aktif", variant: "default" },
  inactive: { label: "Nonaktif", variant: "secondary" },
};

export function SessionTable() {
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
              STATUS
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              AKSI
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mockAdminSessions.map((session: AdminSessionRow) => {
            const status =
              statusConfig[session.isActive ? "active" : "inactive"];

            return (
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
                  {session.endTime}
                </TableCell>

                {/* Kolom Durasi */}
                <TableCell className="px-5 py-4 text-center">
                  <Badge
                    variant="outline"
                    className="min-w-[60px] justify-center"
                  >
                    {session.duration}
                  </Badge>
                </TableCell>

                {/* Kolom Status */}
                <TableCell className="px-5 py-4 text-center">
                  <Badge
                    variant={status.variant}
                    className="min-w-[80px] justify-center"
                  >
                    {status.label}
                  </Badge>
                </TableCell>

                {/* Kolom Aksi: Eye + Pencil + Trash */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Lihat Detail Sesi"
                    >
                      <Eye weight="bold" size={18} />
                    </Button>
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
    </div>
  );
}
