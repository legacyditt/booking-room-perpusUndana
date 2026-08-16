"use client";

import React, { useState } from "react";
import { SessionTable } from "@/features/admin/components/SessionTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { deleteSession } from "@/lib/api/sessions";
import { updateWorkingDays } from "@/lib/api/working-days";
import { Session } from "@/types/booking";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 5;

const DAYS = [
  { id: "senin", label: "Senin" },
  { id: "selasa", label: "Selasa" },
  { id: "rabu", label: "Rabu" },
  { id: "kamis", label: "Kamis" },
  { id: "jumat", label: "Jumat" },
  { id: "sabtu", label: "Sabtu" },
  { id: "minggu", label: "Minggu" },
];

interface SessionsManagementProps {
  sessions: Session[];
  initialWorkingDays?: string[];
}

export function SessionsManagement({
  sessions: initialSessions,
  initialWorkingDays = ["senin", "selasa", "rabu", "kamis", "jumat"],
}: SessionsManagementProps) {
  const [sessions, setSessions] = useState(initialSessions);
  const [page, setPage] = useState(1);

  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(sessions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedSessions = sessions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // State untuk pengaturan hari kerja (diambil server-side, tanpa flash default)
  const [workingDays, setWorkingDays] = useState<string[]>(initialWorkingDays);
  const [isSavingDays, setIsSavingDays] = useState(false);

  const toggleDay = (id: string) => {
    setWorkingDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSaveWorkingDays = async () => {
    setIsSavingDays(true);
    try {
      await updateWorkingDays(workingDays);
      toast.add({
        type: "success",
        title: "Pengaturan Hari Kerja Disimpan",
        description:
          "Pembaruan hari kerja telah berhasil disimpan ke dalam sistem.",
      });
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast.add({
        type: "error",
        title: "Gagal Menyimpan Hari Kerja",
        description: message,
      });
    } finally {
      setIsSavingDays(false);
    }
  };

  const handleDelete = async () => {
    if (!sessionToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSession(sessionToDelete.id);
      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id));
      toast.add({
        type: "success",
        title: "Sesi Berhasil Dihapus",
        description: `Sesi "${sessionToDelete.name}" beserta seluruh datanya telah dihapus secara permanen.`,
      });
      setSessionToDelete(null);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast.add({
        type: "error",
        title: "Tidak Dapat Menghapus Sesi",
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Pengaturan Hari Kerja */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Pengaturan Hari Kerja
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Tentukan hari apa saja perpustakaan dan layanan pemesanan ruangan beroperasi.
            </p>
          </div>
          <Button
            onClick={handleSaveWorkingDays}
            disabled={isSavingDays}
            className="bg-primary text-white hover:bg-primary/90 shrink-0"
          >
            {isSavingDays ? "Menyimpan..." : "Simpan Hari Kerja"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {DAYS.map((day) => {
            const isActive = workingDays.includes(day.id);
            return (
              <label
                key={day.id}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors select-none ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleDay(day.id)}
                  className="hidden"
                />
                <div
                  className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-white border-neutral-300"
                  }`}
                >
                  {isActive && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm">{day.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Area Tabel Data */}
        <div className="flex-1 min-h-[400px] overflow-x-auto">
          <SessionTable sessions={pagedSessions} onDelete={setSessionToDelete} />
        </div>

        {/* Area Pagination */}
        <div className="p-5 border-t border-[#E2E8F0] bg-white">
          <TablePagination
            page={safePage}
            pageSize={PAGE_SIZE}
            totalItems={sessions.length}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={!!sessionToDelete}
        onOpenChange={(open) => {
          if (!open) setSessionToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Sesi</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus sesi{" "}
              <span className="font-semibold">{sessionToDelete?.name}</span>?
              Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSessionToDelete(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
