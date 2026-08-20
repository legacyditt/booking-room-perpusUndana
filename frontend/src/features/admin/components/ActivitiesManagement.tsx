"use client";

import React, { useMemo, useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/features/admin/components/TablePagination";
import type { AdminActivity, AdminUser } from "@/types/admin";
import { useAdminActivities } from "@/lib/hooks/use-admin-activities";

const PAGE_SIZE = 10;

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const actionConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  CREATE_ROOM: { label: "Tambah Ruangan", variant: "default" },
  UPDATE_ROOM: { label: "Ubah Ruangan", variant: "secondary" },
  DELETE_ROOM: { label: "Hapus Ruangan", variant: "destructive" },
  CREATE_SESSION: { label: "Tambah Sesi", variant: "default" },
  UPDATE_SESSION: { label: "Ubah Sesi", variant: "secondary" },
  DELETE_SESSION: { label: "Hapus Sesi", variant: "destructive" },
  APPROVE_BOOKING: { label: "Setujui Booking", variant: "default" },
  REJECT_BOOKING: { label: "Tolak Booking", variant: "destructive" },
  CANCEL_BOOKING: { label: "Batalkan Booking", variant: "secondary" },
  UPDATE_USER_ROLE: { label: "Ubah Peran", variant: "secondary" },
  CREATE_ADMINS: { label: "Tambah Admin", variant: "default" },
  DELETE_USER: { label: "Hapus Pengguna", variant: "destructive" },
};

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface ActivitiesManagementProps {
  activities: AdminActivity[];
  admins: AdminUser[];
}

export function ActivitiesManagement({
  activities: initialActivities,
  admins,
}: ActivitiesManagementProps) {
  const { data: activities = [] } = useAdminActivities(initialActivities);
  const [adminFilter, setAdminFilter] = useState("Semua");
  const [actionFilter, setActionFilter] = useState("Semua");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      const matchAdmin =
        adminFilter === "Semua" || activity.adminId === adminFilter;
      const matchAction =
        actionFilter === "Semua" || activity.action === actionFilter;
      const matchStart = !startDate || activity.createdAt >= startDate;
      const matchEnd =
        !endDate || activity.createdAt.split("T")[0] <= endDate;
      return matchAdmin && matchAction && matchStart && matchEnd;
    });
  }, [activities, adminFilter, actionFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedActivities = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const selectedAdminName =
    adminFilter === "Semua"
      ? "Semua Admin"
      : (admins.find((a) => a.id === adminFilter)?.name ?? adminFilter);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setPage(1);
    if (!endDate || endDate < val) {
      setEndDate(val);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setPage(1);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* ── Filter Bar ── */}
      <div className="p-5 border-b border-[#E2E8F0] bg-white flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Select
            value={adminFilter}
            onValueChange={(v) => {
              if (v) {
                setAdminFilter(v);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue>{selectedAdminName}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Admin</SelectItem>
              {admins.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={actionFilter}
            onValueChange={(v) => {
              if (v) {
                setActionFilter(v);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[190px] h-10 bg-white border-neutral-200 font-medium text-neutral-700">
              <SelectValue>
                {actionFilter === "Semua"
                  ? "Semua Aksi"
                  : actionConfig[actionFilter]?.label ?? actionFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Aksi</SelectItem>
              {Object.entries(actionConfig).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-start sm:items-center flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500 shrink-0">Dari</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="h-10 w-full sm:w-[150px] bg-white border-neutral-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500 shrink-0">Sampai</span>
            <Input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="h-10 w-full sm:w-[150px] bg-white border-neutral-200"
            />
          </div>
          {hasDateFilter && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleClearDate}
              title="Reset filter tanggal"
              className="h-10 w-10 text-neutral-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shrink-0"
            >
              <ArrowCounterClockwise size={18} weight="bold" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Tabel ── */}
      <div className="flex-1 min-h-[380px]">
        <Table className="whitespace-nowrap">
          <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
                ADMIN
              </TableHead>
              <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
                AKSI
              </TableHead>
              <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
                DETAIL
              </TableHead>
              <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
                WAKTU
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedActivities.map((activity) => {
              const config = actionConfig[activity.action] ?? {
                label: activity.action,
                variant: "outline" as BadgeVariant,
              };
              return (
                <TableRow
                  key={activity.id}
                  className="hover:bg-neutral-50/50 transition-colors border-[#E2E8F0]"
                >
                  <TableCell className="px-5 py-4">
                    <span className="font-medium text-primary">
                      {activity.admin.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <Badge
                      variant={config.variant}
                      className="min-w-[130px] justify-center"
                    >
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-neutral-600 max-w-[300px] truncate">
                    {activity.detail ?? "—"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-neutral-600 text-center">
                    {dateTimeFormatter.format(new Date(activity.createdAt))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-neutral-500">
            <p className="text-lg">Tidak ada aktivitas yang cocok.</p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      <div className="p-5 border-t border-[#E2E8F0] bg-white">
        <TablePagination
          page={safePage}
          pageSize={PAGE_SIZE}
          totalItems={filtered.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
