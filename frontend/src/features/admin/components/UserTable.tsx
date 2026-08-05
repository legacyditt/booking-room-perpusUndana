"use client";

import React from "react";
import { Eye, PencilSimple } from "@phosphor-icons/react";
import { mockAdminUsers } from "@/data/mock";
import { AdminUserRow } from "@/types/admin";
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

// ── Union type varian Badge shadcn ──
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

// ── Config Badge untuk Status ──
const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: "Aktif", variant: "default" },
  INACTIVE: { label: "Nonaktif", variant: "secondary" },
  SUSPENDED: { label: "Ditangguhkan", variant: "destructive" },
};

// ── Config Badge untuk Role ──
const roleConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  ADMIN: { label: "Admin", variant: "default" },
  USER: { label: "Pengguna", variant: "outline" },
  LIBRARIAN: { label: "Pustakawan", variant: "secondary" },
};

export function UserTable() {
  return (
    <div className="w-full">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              PROFIL PENGGUNA
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              PERAN
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              TANGGAL BERGABUNG
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
          {mockAdminUsers.map((user: AdminUserRow) => {
            const status = statusConfig[user.status];
            const role = roleConfig[user.role];

            return (
              <TableRow
                key={user.id}
                className="hover:bg-neutral-50/50 transition-colors border-[#E2E8F0]"
              >
                {/* Kolom Nama & Email */}
                <TableCell className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-primary">{user.name}</span>
                    <span className="text-xs text-neutral-500">{user.email}</span>
                  </div>
                </TableCell>

                {/* Kolom Role */}
                <TableCell className="px-5 py-4 text-center">
                  <Badge variant={role.variant} className="min-w-[100px] justify-center">
                    {role.label}
                  </Badge>
                </TableCell>

                {/* Kolom Tanggal Bergabung */}
                <TableCell className="px-5 py-4 text-neutral-600 text-center">
                  {user.joinDate}
                </TableCell>

                {/* Kolom Status */}
                <TableCell className="px-5 py-4 text-center">
                  <Badge
                    variant={status.variant}
                    className="min-w-[100px] justify-center"
                  >
                    {status.label}
                  </Badge>
                </TableCell>

                {/* Kolom Aksi (Hanya Eye dan Edit) */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Lihat Detail Pengguna"
                    >
                      <Eye weight="bold" size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-primary w-8 h-8"
                      title="Edit Pengguna"
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
