"use client";

import React, { useState, useMemo } from "react";
import { SessionTable } from "@/features/admin/components/SessionTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
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
import { useSessions } from "@/lib/hooks/use-sessions";
import { useDeleteSession } from "@/lib/hooks/use-delete-session";

const PAGE_SIZE = 5;

interface SessionsManagementProps {
  sessions: Session[];
}

export function SessionsManagement({
  sessions: initialSessions,
}: SessionsManagementProps) {
  const { data: rawSessions = [] } = useSessions(initialSessions);
  const [page, setPage] = useState(1);

  // Sorting: "Reguler & Sewa" (isRentOnly = false) di atas, lalu urut waktu mulai (startTime asc)
  const sessions = useMemo(() => {
    return [...rawSessions].sort((a, b) => {
      if (a.isRentOnly !== b.isRentOnly) {
        return a.isRentOnly ? 1 : -1;
      }
      return (a.startTime ?? "").localeCompare(b.startTime ?? "");
    });
  }, [rawSessions]);

  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  const deleteMutation = useDeleteSession();
  const isDeleting = deleteMutation.isPending;

  const totalPages = Math.max(1, Math.ceil(sessions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedSessions = sessions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleDelete = () => {
    if (!sessionToDelete) return;

    deleteMutation.mutate(sessionToDelete.id, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "Sesi Berhasil Dihapus",
          description: `Sesi "${sessionToDelete.name}" beserta seluruh datanya telah dihapus secara permanen.`,
        });
        setSessionToDelete(null);
      },
      onError: (error) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
        toast.add({
          type: "error",
          title: "Tidak Dapat Menghapus Sesi",
          description: message,
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
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
